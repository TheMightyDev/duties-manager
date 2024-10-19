import { type UserJustice } from "@/server/api/types/user-justice";

interface SharedParams {
	userJustices: UserJustice[];
	ascending: boolean;

}
export function sortUserJusticesByWeightedScore({
	userJustices,
	ascending,
} : SharedParams): UserJustice[] {
	const sorter = ascending
		? (a: UserJustice, b: UserJustice) => a.weightedScore - b.weightedScore
		: (a: UserJustice, b: UserJustice) => b.weightedScore - a.weightedScore;
		
	return userJustices.sort(sorter);
}

export function sortUserJusticesByFullName({
	userJustices,
	ascending,
} : SharedParams): UserJustice[] {
	const sorter = ascending
		? (a: UserJustice, b: UserJustice) => a.userFullName > b.userFullName ? 1 : -1
		: (a: UserJustice, b: UserJustice) => b.userFullName > a.userFullName ? 1 : -1;
		
	return userJustices.sort(sorter);
}

export function sortUserJusticesByTotalMonthsInRole({
	userJustices,
	ascending,
} : SharedParams): UserJustice[] {
	const sorter = ascending
		? (a: UserJustice, b: UserJustice) => a.monthsInRole - b.monthsInRole
		: (a: UserJustice, b: UserJustice) => b.monthsInRole - a.monthsInRole;
		
	return userJustices.sort(sorter);
}
