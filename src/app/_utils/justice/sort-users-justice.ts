import { type UserJustice } from "@/app/_types/justice/user-justice";
import { type UserJusticeTableColId } from "@/app/_utils/justice/users-justice-table-cols";

export interface SortUsersJusticeParams {
	colIdToSortBy: UserJusticeTableColId;
	ascending: boolean;
}

export type UsersJusticeCompareFn = (a: UserJustice, b: UserJustice) => number;

function getUsersJusticeCompareFn({
	colIdToSortBy,
	ascending,
}: SortUsersJusticeParams): UsersJusticeCompareFn {
	return (a: UserJustice, b: UserJustice) => (b[colIdToSortBy] > a[colIdToSortBy] ? 1 : -1) * (ascending ? -1 : 1);
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
