import { DAYS_IN_MONTH, USE_DEFAULT_SCORE } from "@/app/_utils/constants";
import { type UserWithPeriodsAndAssignments } from "@/server/api/types/user-with-periods-and-assignments";
import { type UserJustice } from "@/types/justice/user-justice";
import { DutyKind } from "@prisma/client";
import { differenceInDays } from "date-fns";

function calcMonthsInRole({
	periods,
	definitiveDate,
}: {
	periods: UserWithPeriodsAndAssignments["periods"];
	definitiveDate: Date;
}): number {
	// There's no need to filter the relevant periods, because the filtering
	// is done when querying the DB
	const daysDiffSum = periods.reduce((sum, period) => {
		const actualEndDate = period.endDate > definitiveDate ? definitiveDate : period.endDate;
		const periodDaysDiff = differenceInDays(actualEndDate, period.startDate);
		
		return sum + periodDaysDiff;
	}, 0);
	
	const monthsInRole = daysDiffSum / DAYS_IN_MONTH;
	
	return monthsInRole;
}

/** ## Expected input
 *
 *  This function assumes it receives a user with periods and assignments
 * only of a desired role (e.g. just SQUAD).
 * The periods must also be periods that user fulfills the role.
*/
export function calcUserJustice({
	userWithPeriodsAndAssignments: user,
	definitiveDate,
}: {
	userWithPeriodsAndAssignments: UserWithPeriodsAndAssignments;
	definitiveDate: Date;
}): UserJustice {
	const userJustice: UserJustice = {
		userId: user.id,
		userFullName: user.firstName + " " + user.lastName,
		monthsInRole: calcMonthsInRole({
			periods: user.periods,
			definitiveDate,
		}),
		weekdaysGuardingCount: 0,
		weekendsGuardingCount: 0,
		otherDutiesScoreSum: 0,
		totalScore: 0,
		weightedScore: 0,
	};
	
	if (userJustice.monthsInRole === 0) {
		return userJustice;
	}
	
	user.assignments.forEach((assignment) => {
		const duty = assignment.duty;
		if (duty.kind === DutyKind.GUARDING) {
			const dutyDuration = differenceInDays(duty.endDate, duty.startDate);
				
			if (dutyDuration > 2) {
				userJustice.weekendsGuardingCount += 1;
				userJustice.totalScore += duty.score === USE_DEFAULT_SCORE ? 3 : duty.score;
			} else {
				userJustice.weekdaysGuardingCount += 1;
				userJustice.totalScore += duty.score === USE_DEFAULT_SCORE ? 1 : duty.score;
			}
		} else {
			userJustice.otherDutiesScoreSum += duty.score;
			userJustice.totalScore += duty.score;
		}
	});
	
	userJustice.weightedScore = Number((userJustice.totalScore / userJustice.monthsInRole).toFixed(2));

	userJustice.monthsInRole = Number(userJustice.monthsInRole.toFixed(2));
	
	return userJustice;
}
