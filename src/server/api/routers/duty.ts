import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure
} from "@/server/api/trpc";
import { dutyWithAssignmentsInclude } from "@/server/api/types/duty-with-assignments";
import { DutiesSelectOptionsSchema } from "@/types/duties/duties-select-options-schema";
import { UTCDate } from "@date-fns/utc";

export const dutyRouter = createTRPCRouter({
	/** Returns all duties that match the given criteria:
	 * - They **start** in the specified year
	 * - If provided, they precisely **start** in the specified month
	 * - If provided, they are one of the specified kinds
	 * - If provided, they require one (or optionally more) of the specified user roles
	 *  */
	getManyDuties: protectedProcedure
		.input(DutiesSelectOptionsSchema)
		.query((async ({ ctx, input }) => {
			const loggedUserOrganizationId = ctx.session.user.organizationId;
			
			const specifiedStartDate = new UTCDate(
				input.startYear,
				input.startMonthIndex ?? 0,
				1,
				0,
				0,
				0
			);
			const specifiedEndDate = new UTCDate(
				input.startYear,
				// If a start month index wasn't specified, we add 12 months
				// to advance to the start of the following year
				input.startMonthIndex !== null
					? input.startMonthIndex + 1
					: 12,
				1,
				0,
				0,
				0
			);
				
			const duties = await ctx.db.duty.findMany({
				where: {
					organizationId: loggedUserOrganizationId,
					startDate: {
						gte: specifiedStartDate,
						lt: specifiedEndDate,
					},
					...(
						input.kinds
							? {
								kind: {
									in: input.kinds,
								},
							}
							: {}
					),
					...(
						input.requiredUserRoles
							? {
								requiredRoles: {
									hasSome: input.requiredUserRoles,
								},
							}
							: {}
					),
				},
				include: dutyWithAssignmentsInclude,
				orderBy: {
					startDate: "asc",
				},
			});
			
			return duties;
		})),
		
	/** Returns all duties that either start or the end on the input month */
	getAllInMonth: publicProcedure
		.input(z.object({
			year: z.number(),
			monthIndex: z.number().min(0).max(11),
		}))
		.query((async ({ ctx, input: { year, monthIndex } }) => {
			const firstDayInMonth = new Date(year, monthIndex, 1);
			const lastDayInMonth = new Date(year, monthIndex + 1, 0, 59, 59, 999);
			
			return ctx.db.duty.findMany({
				where: {
					OR: [
						{
							startDate: {
								gte: firstDayInMonth,
								lte: lastDayInMonth,
							},
						},
						{
							endDate: {
								gte: firstDayInMonth,
								lte: lastDayInMonth,
							},
						},
					],
				},
				include: dutyWithAssignmentsInclude,
			});
		})),
});
