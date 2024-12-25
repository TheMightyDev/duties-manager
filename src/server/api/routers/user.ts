import { UTCDate } from "@date-fns/utc";
import { z } from "zod";

import {
	adminProcedure,
	createTRPCRouter,
	protectedProcedure,
	publicProcedure
} from "@/server/api/trpc";
import { type UserWithPeriodsAndAssignments } from "@/server/api/types/user-with-periods-and-assignments";
import { calcUserJustice } from "@/server/api/utils/calc-user-justice";
import { userBasicInfoFormSchema } from "@/types/forms/user-basic-info-form-schema";
import { type RoleRecord, roleRecordSchema } from "@/types/user/role-record";
import { PeriodStatus, type PrismaClient, type User, UserRole } from "@prisma/client";
import { endOfDay } from "date-fns";
import { PeriodSchema, UserSchema } from "prisma/generated/zod";

async function fetchUsersByRole({ role, definitiveDate, ctxDb, includeExemptAndAbsentUsers, fetchPrivateDuties }: {
	ctxDb: PrismaClient;
	role: UserRole;
	definitiveDate: Date;
	includeExemptAndAbsentUsers: boolean;
	fetchPrivateDuties: boolean;
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
						requiredRoles: {
							has: role,
						},
						...(
							fetchPrivateDuties
								? {}
								// If we only fetch public duties, a requirement for the duty is to not be private
								: {
									isPrivate: false,
								}
						),
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
						gt: definitiveDate,
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
	getUserBasicInfoById: protectedProcedure
		.input(z.string())
		.output(UserSchema.nullable())
		.query((async ({ ctx, input: userId }) => {
			const user = await ctx.db.user.findUnique({
				where: {
					id: userId,
				},
			});
			
			return user;
		})),
		
	getUserFullNameById: protectedProcedure
		.input(z.string())
		.query((async ({ ctx, input: userId }) => {
			const user = await ctx.db.user.findUnique({
				select: {
					firstName: true,
					lastName: true,
				},
				where: {
					id: userId,
				},
			});
			
			if (!user) {
				return null;
			}
			
			const fullName = user.firstName + " " + user.lastName;
			
			return fullName;
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
			const isLoggedUserAdmin = Boolean(ctx.session?.user.isAdmin);
			const definitiveDate = _definitiveDate ?? endOfDay(new Date());
			
			/** An array of arrays of users - all users in each nested array are of the same role */
			const usersByRole = await Promise.all(
				roles.map((role) => fetchUsersByRole({
					ctxDb: ctx.db,
					role,
					definitiveDate,
					includeExemptAndAbsentUsers,
					fetchPrivateDuties: isLoggedUserAdmin,
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
	 * This is a public procedure because it's called during login to cache the roles the user fulfilled in session!
	 *
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
	getAllUserRolesById: publicProcedure
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
			
			if (!userWithPeriods) {
				return null;
			}
			
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
			
			const fulfilledSorted = fulfilledRolesSoFar.sort((recordA, recordB) => {
				if (recordA.latestFulfilledDate === null) return 1;
				
				if (recordB.latestFulfilledDate === null) return -1;
				
				return (recordA.latestFulfilledDate.getTime() > recordB.latestFulfilledDate.getTime()) ? 1 : -1;
			});
			
			console.log("@@fulfilledRolesSoFar", fulfilledSorted);
			
			return fulfilledSorted;
		})),
	
	/**
	 * Returns all assignments of a specific user,
	 * ordered from the latest duty to the oldest duty
	 */
	getUserAssignments: protectedProcedure
		.input(z.object({
			userId: z.string(),
			role: z.nativeEnum(UserRole).optional(),
		}))
		.query((async ({ ctx, input: { userId, role } }) => {
			const isLoggedUserAdmin = Boolean(ctx.session?.user.isAdmin);
			
			const userWithAssignments = await ctx.db.user.findUnique({
				where: {
					id: userId,
				},
				include: {
					assignments: {
						where: {
							duty: {
								...(
									role
										? {
											requiredRoles: {
												has: role,
											},
										}
										: {}
								),
								...(
									isLoggedUserAdmin
										? {}
										// If we only fetch public duties, a requirement for the duty is to not be private
										: {
											isPrivate: false,
										}
								),
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
					periods: {
						orderBy: {
							startDate: "asc",
						},
					},
				},
			});
			
			return userWithPeriods?.periods;
		})),
		
	/** Returns an object whose keys are full names of each
	 * user in the organization, and values are the IDs.
	 * E.g. a pair in this object can be:
	 * ```
	 * John Black - 8jhwsjsdr34
	 * ```
	 */
	getAllUsersFullNameAndId: adminProcedure
		.query((async ({ ctx }) => {
			const allUsers = await ctx.db.user.findMany({
				select: {
					id: true,
					firstName: true,
					lastName: true,
				},
				where: {
					organizationId: ctx.session.user.organizationId,
				},
			});
			
			/** An object where each key is a full name of a user in the organization and the value is its ID */
			const allUsersIds: Record<string, User["id"]> = {};
			
			allUsers.forEach((user) => {
				const fullName = user.firstName + " " + user.lastName;
				allUsersIds[fullName] = user.id;
			});
			
			return allUsersIds;
		})),
	
	/** Returns an object whose keys are phone numbers of each
	 * user in the organization, and values are the full name of the phone owner.
	 * Note that the phone number doesn't include dashes (-)
	 * E.g. a pair in this object can be:
	 * ```
	 * 0521234567 - John Black
	 * ```
	 */
	getAllUsersPhoneNumberAndFullName: adminProcedure
		.query((async ({ ctx }) => {
			const allUsers = await ctx.db.user.findMany({
				select: {
					id: true,
					phoneNumber: true,
					firstName: true,
					lastName: true,
				},
				where: {
					organizationId: ctx.session.user.organizationId,
				},
			});
			
			/** An object where each key is a phone number of a user in the organization and the value is its string */
			const allUsersIds: Record<string, string> = {};
			
			allUsers.forEach((user) => {
				const fullName = user.firstName + " " + user.lastName;
				allUsersIds[user.phoneNumber.replaceAll("-", "")] = fullName;
			});
			
			return allUsersIds;
		})),
		
	replacePeriods: adminProcedure
		.input(z.object({
			userId: z.string(),
			nextPeriods: z.array(PeriodSchema),
		}))
		.query((async ({ ctx, input }) => {
			const oldPeriodsIds = (
				await ctx.db.period.findMany({
					select: {
						id: true,
					},
					where: {
						userId: input.userId,
					},
				})
			).map((period) => period.id);
			
			await ctx.db.period.createMany({
				data: input.nextPeriods,
			});
			
			await ctx.db.period.deleteMany({
				where: {
					id: {
						in: oldPeriodsIds,
					},
				},
			});
		})),
		
	updateUserInfo: adminProcedure
		.input(userBasicInfoFormSchema)
		.query((async ({ ctx, input }) => {
			const {
				id,
				...changes
			} = input;
			
			return await ctx.db.user.update({
				where: {
					id,
				},
				data: changes,
			});
		})),
});
