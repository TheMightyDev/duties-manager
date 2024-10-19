import { type UserJustice } from "@/app/_types/justice/user-justice";

export enum UserJusticeSortBy {
	WeightedScore = "score",
	FullName = "name",
	TotalMonthsInRole = "months",
}

export interface SortUsersJusticeParams {
	sortBy: UserJusticeSortBy;
	ascending: boolean;
}

export type UsersJusticeCompareFn = (a: UserJustice, b: UserJustice) => number;

function getUsersJusticeCompareFn({
	sortBy,
	ascending,
}: SortUsersJusticeParams): UsersJusticeCompareFn {
	switch (sortBy) {
		case UserJusticeSortBy.WeightedScore:
			return (a: UserJustice, b: UserJustice) => (b.weightedScore - a.weightedScore) * (ascending ? -1 : 1);
		case UserJusticeSortBy.FullName:
			return (a: UserJustice, b: UserJustice) => (b.userFullName > a.userFullName ? 1 : -1) * (ascending ? -1 : 1);
		case UserJusticeSortBy.TotalMonthsInRole:
			return (a: UserJustice, b: UserJustice) => (b.monthsInRole - a.monthsInRole) * (ascending ? -1 : 1);
		default:
			return (_a: UserJustice, _b: UserJustice) => 1;
	}
}

export function sortUsersJustice({
	usersJustice,
	...sortParams
}: SortUsersJusticeParams & {
	usersJustice: UserJustice[];
}): UserJustice[] {
	const compareFn = getUsersJusticeCompareFn(sortParams);
	
	return usersJustice.sort(compareFn);
}
