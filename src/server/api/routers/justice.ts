import { z } from "zod";

import {
	createTRPCRouter,
	publicProcedure
} from "@/server/api/trpc";
import { type UserJustice } from "@/server/api/types/user-justice";
import { userWithAssignmentsInclude } from "@/server/api/types/user-with-assignments";
import { DutyKind, UserRole } from "@prisma/client";
import { differenceInDays } from "date-fns";

enum DutyKindForJustice {
	WEEKDAY_GUARDING,
	WEEKEND_GUARDING,
	OTHER,
}

function parseDutyKindForJustice({ kind: dutyKind, startDate, endDate }: {
	kind: DutyKind;
	startDate: Date;
	endDate: Date;
}): DutyKindForJustice {
	if (dutyKind === DutyKind.GUARDING) {
		const daysDiff = differenceInDays(endDate, startDate);

		return daysDiff < 2
			? DutyKindForJustice.WEEKDAY_GUARDING
			: DutyKindForJustice.WEEKEND_GUARDING;
	} else {
		return DutyKindForJustice.OTHER;
	}
}

function countTotalScore({ userJustice }: {
	userJustice: UserJustice;
}): number {
	const totalScore = (
		userJustice.weekdaysGuardingCount +
		userJustice.weekendsGuardingCount * 3 +
		userJustice.otherDutiesScoreSum
	);
	
	return totalScore;
}

export const justiceRouter = createTRPCRouter({
	/** Returns all duties that either start or the end on the input month */
	getUsersJustice: publicProcedure
		.input(z.object({
			roles: z.array(z.nativeEnum(UserRole)),
			year: z.number(),
			monthIndex: z.number().min(0).max(11),
		}))
		.query((async ({ ctx, input: { roles, year, monthIndex } }) => {
			const firstDayInMonth = new Date(year, monthIndex, 1);
			const lastDayInMonth = new Date(year, monthIndex + 1, 0, 59, 59, 999);
			
			const usersWithAssignments = await ctx.db.user.findMany({
				include: userWithAssignmentsInclude,
			});
			
			const usersJustices = usersWithAssignments.map<UserJustice>((user) => {
				const userJustice: UserJustice = {
					userId: user.id,
					monthsInRole: differenceInDays(Date.now(), user.roleStartDate) / 30,
					weekdaysGuardingCount: 0,
					weekendsGuardingCount: 0,
					otherDutiesScoreSum: 0,
					totalScore: 0,
					weightedScore: 0,
				};
				
				user.assignments.forEach((assignment) => {
					// Users can switch roles, assignments might refer to older role, we ignore such assignments
					if (assignment.duty.role !== user.role) {
						return;
					}
					
					const dutyKindForJustice = parseDutyKindForJustice(assignment.duty);
					
					if (dutyKindForJustice === DutyKindForJustice.WEEKDAY_GUARDING) {
						userJustice.weekdaysGuardingCount += 1;
					} else if (dutyKindForJustice === DutyKindForJustice.WEEKEND_GUARDING) {
						userJustice.weekendsGuardingCount += 1;
					} else {
						userJustice.otherDutiesScoreSum += assignment.duty.score;
					}
				});
				
				userJustice.totalScore = countTotalScore({
					userJustice,
				});
				
				userJustice.weightedScore = Number((userJustice.totalScore / userJustice.monthsInRole).toFixed(2));
				
				return userJustice;
			});
			
			return usersJustices;
		})),
});
