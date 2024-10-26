import { z } from "zod";

import {
	createTRPCRouter,
	publicProcedure
} from "@/server/api/trpc";
import { userWithAllEventsInclude } from "@/server/api/types/user-with-all-events";
import { type UserWithPeriodsAndAssignments } from "@/server/api/types/user-with-periods-and-assignments";
import { calcUserJustice } from "@/server/api/utils/calc-user-justice";
import { PeriodStatus, type PrismaClient, UserRole } from "@prisma/client";
import { endOfDay } from "date-fns";

async function fetchUsersByRole({ role, definitiveDate, ctxDb, includeExemptAndAbsentUsers }: {
	ctxDb: PrismaClient;
	role: UserRole;
	definitiveDate: Date;
	includeExemptAndAbsentUsers: boolean;
}) {
	const users: UserWithPeriodsAndAssignments[] = await ctxDb.user.findMany({
		include: {
			periods: {
				select: {
					startDate: true,
					endDate: true,
					role: true,
					status: true,
				},
				where: {
					startDate: {
						lte: definitiveDate,
					},
					role: role,
					status: PeriodStatus.FULFILLS_ROLE,
				},
			},
			assignments: {
				include: {
					duty: {
						select: {
							startDate: true,
							endDate: true,
							score: true,
							kind: true,
						},
					},
				},
				where: {
					duty: {
						startDate: {
							lte: definitiveDate,
						},
						role: role,
					},
				},
			},
		},
		where: {
			periods: {
				some: {
					startDate: {
						lte: definitiveDate,
					},
					endDate: {
						gte: definitiveDate,
					},
					role: role,
					status: {
						in: includeExemptAndAbsentUsers ? [
							PeriodStatus.FULFILLS_ROLE,
							PeriodStatus.TEMPORARILY_EXEMPT,
							PeriodStatus.TEMPORARILY_ABSENT,
						] : [
							PeriodStatus.FULFILLS_ROLE,
						],
					},
				},
			},
		},
	});

	return users;
}

export const userRouter = createTRPCRouter({
	getAllUserEventsById: publicProcedure
		.input(z.string())
		.query((async ({ ctx, input: userId }) => {
			const userWithAllEvents = await ctx.db.user.findFirst({
				include: userWithAllEventsInclude,
				where: {
					id: userId,
				},
			});
			
			return userWithAllEvents;
		})),
		
	getUserJustice: publicProcedure
		.input(z.object({
			userId: z.string(),
			definitiveDate: z.date(),
		}))
		.query((async ({ ctx, input: { userId, definitiveDate } }) => {
			const userWithCurrentPeriod = await ctx.db.user.findFirst({
				include: {
					periods: {
						where: {
							AND: [
								{
									startDate: {
										lte: definitiveDate,
									},
								},
								{
									endDate: {
										gte: definitiveDate,
									},
								},
							],
						},
					},
				},
				where: {
					id: userId,
				},
			});
			
			if (!(userWithCurrentPeriod?.periods[0])) return null;
			
			const currentRole = userWithCurrentPeriod.periods[0].role;
			
			const userWithPeriodsAndAssignments: UserWithPeriodsAndAssignments | null = await ctx.db.user.findFirst({
				include: {
					periods: {
						select: {
							startDate: true,
							endDate: true,
							role: true,
							status: true,
						},
						where: {
							AND: [
								{
									startDate: {
										lte: definitiveDate,
									},
								},
								{
									role: currentRole,
								},
								{
									status: PeriodStatus.FULFILLS_ROLE,
								},
							],
						},
					},
					assignments: {
						include: {
							duty: {
								select: {
									startDate: true,
									endDate: true,
									score: true,
									kind: true,
								},
							},
						},
						where: {
							duty: {
								startDate: {
									lte: definitiveDate,
								},
								role: currentRole,
							},
						},
					},
				},
				where: {
					id: userId,
				},
			});
			
			if (!userWithPeriodsAndAssignments) return null;
			
			return calcUserJustice({
				userWithPeriodsAndAssignments,
				definitiveDate,
			});
		})),
	
	getManyUsersJustice: publicProcedure
		.input(z
			.object({
				roles: z.array(z.nativeEnum(UserRole)),
				definitiveDate: z.date(),
				includeExemptAndAbsentUsers: z.boolean(),
			}))
		.query((async ({
			ctx, input: {
				definitiveDate: _definitiveDate,
				roles,
				includeExemptAndAbsentUsers,
			},
		}) => {
			const definitiveDate = _definitiveDate ?? endOfDay(new Date());
			
			/** An array of arrays of users - all users in each nested array are of the same role */
			const usersByRole = await Promise.all(
				roles.map((role) => fetchUsersByRole({
					ctxDb: ctx.db,
					role,
					definitiveDate,
					includeExemptAndAbsentUsers,
				}))
			);
			
			const usersJustice = usersByRole.flat(1).map((user) => (
				calcUserJustice({
					userWithPeriodsAndAssignments: user,
					definitiveDate,
				})));
				
			return usersJustice;
		})),
});
