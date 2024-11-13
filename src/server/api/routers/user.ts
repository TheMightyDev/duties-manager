import { UTCDate } from "@date-fns/utc";
import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure
} from "@/server/api/trpc";
import { userWithAllEventsInclude } from "@/server/api/types/user-with-all-events";
import { type UserWithPeriodsAndAssignments } from "@/server/api/types/user-with-periods-and-assignments";
import { calcUserJustice } from "@/server/api/utils/calc-user-justice";
import { type RoleRecord, roleRecordSchema } from "@/types/user/role-record";
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
				orderBy: [
					{
						startDate: "asc",
					},
				],
				where: {
					startDate: {
						lte: definitiveDate,
					},
					role: role,
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
								// We don't only find periods with "FULFILLS_ROLE" status (filtering happens when calculating users justice)
								// because we want to find out the user's current status.
							],
						},
						orderBy: [
							{
								startDate: "asc",
							},
						],
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
	
	/**
	 * Finds all roles fulfilled by a specific user (given their ID)
	 * so far as of *today* (future roles are not taken into account).
	 * Returns an array of objects that have 2 properties:
	 *
	 * - `role`
	 * - `latestFulfilledDate` - the latest date which the role was fulfilled by the user.
	 *
	 * Each role only appears once. The order of the roles is the order in which they were fulfilled
	 * For example, if the periods have "holes" (e.g. a user was a `SQUAD` -> `EXEMPT` -> `SQUAD` again),
	 * then the returned result is
	 * ```ts
	 * [ {
	 * 	role: UserRole.EXEMPT,
	 * 	latestFulfilledRole: LAST_DAY_WAS_EXEMPT,
   * }, {
	 * 	role: UserRole.SQUAD,
	 * 	latestFulfilledRole: TODAY,
	 * } ]
	 * ```
	 */
	getAllUserRolesById: protectedProcedure
		.input(z.string())
		.output(z.array(roleRecordSchema).nullable())
		.query((async ({ ctx, input: userId }) => {
			const todayEnd = endOfDay(new UTCDate());
			
			const userWithPeriods = await ctx.db.user.findUnique({
				where: {
					id: userId,
				},
				include: {
					periods: {
						select: {
							startDate: true,
							endDate: true,
							role: true,
						},
						where: {
							startDate: {
								lte: todayEnd,
							},
						},
					},
				},
			});
			
			const fulfilledRolesSoFar: RoleRecord[] = [];
			
			userWithPeriods?.periods.forEach(({ role, endDate }) => {
				const record = fulfilledRolesSoFar.find((curr) => curr.role === role);
				
				// We advance the endDate to be as latest as known
				if (record) {
					// If it's `null` - meaning that's the user current role and we stick to it.
					record.latestFulfilledDate = record.latestFulfilledDate === null
						? null
						: endDate > todayEnd ? null : endDate;
				} else {
					fulfilledRolesSoFar.push({
						role,
						latestFulfilledDate: endDate > todayEnd ? null : endDate,
					});
				}
			});
			
			const fulfilled = fulfilledRolesSoFar?.filter((role) => role.latestFulfilledDate).sort((recordA, recordB) => (
				recordA.latestFulfilledDate === null ? -1 : (Number(recordA.latestFulfilledDate) - Number(recordB.latestFulfilledDate) ? 1 : -1)
			)).concat(
				fulfilledRolesSoFar.find((f) => f.latestFulfilledDate == null)!
			);
			
			console.log("@@fulfilledRolesSoFar", fulfilled);
			
			if (!userWithPeriods) {
				return null;
			}
			
			return fulfilled;
		})),
		
	getUserAssignments: protectedProcedure
		.input(z.object({
			userId: z.string(),
			role: z.nativeEnum(UserRole).optional(),
		}))
		.query((async ({ ctx, input: { userId, role } }) => {
			const userWithAssignments = await ctx.db.user.findUnique({
				where: {
					id: userId,
				},
				include: {
					assignments: {
						where: {
							duty: {
								role: role,
							},
						},
						include: {
							duty: true,
						},
						orderBy: [
							{
								duty: {
									startDate: "desc",
								},
							},
						],
					},
				},
			});
			
			return userWithAssignments?.assignments;
		})),
	
	/** Returns all periods of a user ordered chronologically,
	 * starting from the very first period and the last one.
	 */
	getUserPeriodsById: protectedProcedure
		.input(z.string())
		.query((async ({ ctx, input: userId }) => {
			const userWithPeriods = await ctx.db.user.findUnique({
				where: {
					id: userId,
				},
				include: {
					periods: true,
				},
			});
			
			return userWithPeriods?.periods;
		})),
});
