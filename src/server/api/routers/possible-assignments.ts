import { z } from "zod";

import {
	createTRPCRouter,
	publicProcedure
} from "@/server/api/trpc";
import { PreferenceImportance, UserRole } from "@prisma/client";

export const possibleAssignmentsRouter = createTRPCRouter({
	/** Finds all users that didn't submit any preference that
	 * falls in the given date range, including those
	 * without absences and temporary can't-guard.
	 *
	 * TODO: The users are sorted by their weighted score in an ascending order (lowest first)
	 *
	 * TODO: Turn into a given duty (and then we can find out if it requires guarding, and find filter users by that fact...)
	 */
	getPossibleAssignees: publicProcedure
		.input(z.object({
			dutyStartDate: z.date(),
			dutyEndDate: z.date(),
			requiredRole: z.nativeEnum(UserRole),
		}))
		.query((async ({ ctx, input: { dutyStartDate, dutyEndDate, requiredRole } }) => {
			const relevantUsers = await ctx.db.user.findMany({
				where: {
					role: requiredRole,
					// A user cannot be assigned to a duty if they're assigned to a duty during the desired duty
					assignments: {
						none: {
							duty: {
								startDate: {
									lte: dutyEndDate,
								},
								endDate: {
									gte: dutyStartDate,
								},
							},
						},
					},
					// All preferences must not overlap with the duty, unless
					// it's a preference that eases guarding
					preferences: {
						none: {
							startDate: {
								lte: dutyEndDate,
							},
							endDate: {
								gte: dutyStartDate,
							},
							AND: [
								{
									importance: {
										not: PreferenceImportance.EASE_GUARDING,
									},
								},
							],
						},
					},
					roleStartDate: {
						lte: dutyStartDate,
					},
					retireDate: {
						gte: dutyEndDate,
					},
				},
			});
			
			return relevantUsers;
		})),
	
	getPossibleAssigneesToDutyById: publicProcedure
		.input(z.string())
		.query((async ({ ctx, input: dutyId }) => {
			const duty = await ctx.db.duty.findFirst({
				where: {
					id: dutyId,
				},
			});
			
			if (!duty) {
				throw new Error(`There's no duty with the given ID (${dutyId})`);
			}
			
			const relevantUsers = await ctx.db.user.findMany({
				where: {
					role: duty.role,
					// A user cannot be assigned to a duty if they're assigned to a duty during the desired duty
					assignments: {
						none: {
							duty: {
								startDate: {
									lte: duty.endDate,
								},
								endDate: {
									gte: duty.startDate,
								},
							},
						},
					},
					// All preferences must not overlap with the duty, unless
					// it's a preference that eases guarding
					preferences: {
						none: {
							startDate: {
								lte: duty.endDate,
							},
							endDate: {
								gte: duty.startDate,
							},
							AND: [
								{
									importance: {
										not: PreferenceImportance.EASE_GUARDING,
									},
								},
							],
						},
					},
					roleStartDate: {
						lte: duty.startDate,
					},
					retireDate: {
						gte: duty.endDate,
					},
				},
			});
			
			return relevantUsers;
		})),
});
