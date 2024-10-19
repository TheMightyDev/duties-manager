import { type UserRole } from "@prisma/client";

export enum UserJusticeSortBy {
	WeightedScore,
	FullName,
	TotalMonthsInRole,
}

export interface FetchJusticeParams {
	roles: UserRole[];
	definitiveDate: Date;
	sortBy: UserJusticeSortBy;
	shouldSortAscending: boolean;
}
