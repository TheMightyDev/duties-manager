import { DAYS_IN_MONTH, USE_DEFAULT_SCORE } from "@/app/_utils/constants";
import { type UserWithPeriodsAndAssignments } from "@/server/api/types/user-with-periods-and-assignments";
import { type UserJustice } from "@/types/justice/user-justice";
import { DutyKind, PeriodStatus } from "@prisma/client";
import { differenceInDays } from "date-fns";

function calcMonthsInRole({
	periods,
	definitiveDate,
}: {
	periods: UserWithPeriodsAndAssignments["periods"];
	definitiveDate: Date;
}): number {
	// There's no need to find periods in which to user fulfills the role
	const daysDiffSum = periods
		.filter((period) => period.status === PeriodStatus.FULFILLS_ROLE)
		.reduce((sum, period) => {
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
	// It can't be null, because there must be at least one period
	const role = user.periods[0]!.role;
	// We sort the periods by their occurrence date (ascending), so the last period
	// is the most recent
	const latestPeriodStatus = user.periods.at(-1)!.status;
	
	const userJustice: UserJustice = {
		userId: user.id,
		userFullName: user.firstName + " " + user.lastName,
		role,
		latestPeriodStatus,
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
	
	// The months in role can be zero if it's the user's first day in role
	// It can't be negative, but we check it just in case.
	userJustice.weightedScore = userJustice.monthsInRole > 0
		? Number((userJustice.totalScore / userJustice.monthsInRole).toFixed(2))
		: 0;

	userJustice.monthsInRole = Number(userJustice.monthsInRole.toFixed(2));
	
	return userJustice;
}
