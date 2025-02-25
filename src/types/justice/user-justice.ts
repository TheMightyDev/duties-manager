import { type PeriodStatus, type UserRole } from "@prisma/client";

export interface UserJustice {
	userId: string;
	userFullName: string;
	role: UserRole;
	latestPeriodStatus: PeriodStatus;
	/** The number of months the user is in the role
	 * (excluding absences and exemptions that exempt from guarding).
	 * Can be a floating point number.
	 */
	monthsInRole: number;
	weekdaysGuardingCount: number;
	weekendsGuardingCount: number;
	campAndSettlementDefenseCount: number;
	/** The number of duties overlapped with any holiday.
	 * Note that the number doesn't contribute to the total number of duties -
	 * it represents a subset of all duties
	*/
	holidayOverlapsCount: number;
	otherDutiesScoreSum: number;
	extraScoresSum: number;
	/** Score granted from all duties done by user */
	totalScore: number;
	/** Score relative to time passed since role start -
	 * total score divided by months in role
	 */
	weightedScore: number;
}
