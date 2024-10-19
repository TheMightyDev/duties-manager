import { type UserJustice } from "@/server/api/types/user-justice";
import { type UserRole } from "@prisma/client";

export enum UserJusticeSortBy {
	WeightedScore = "score",
	FullName = "name",
	TotalMonthsInRole = "months",
}

export interface FetchUsersJusticeParams {
	roles: UserRole[];
	definitiveDate: Date;
}

export interface SortUsersJusticeParams {
	sortBy: UserJusticeSortBy;
	ascending: boolean;
}

export type FetchUsersJusticeFunc = (params: FetchUsersJusticeParams) => Promise<UserJustice[]>;

export type UsersJusticeCompareFn = (a: UserJustice, b: UserJustice) => number;
