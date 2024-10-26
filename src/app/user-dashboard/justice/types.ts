import { type SortUsersJusticeParams } from "@/app/_utils/justice/sort-users-justice";
import { type UserJustice } from "@/types/justice/user-justice";
import { type UserRole } from "@prisma/client";

export interface UsersJusticeTableSettings {
	sortParams: SortUsersJusticeParams;
	fetchParams: FetchUsersJusticeParams;
}

export interface FetchUsersJusticeParams {
	roles: UserRole[];
	definitiveDate: Date;
	includeExemptAndAbsentUsers: boolean;
}

export type FetchUsersJusticeFunc = (params: FetchUsersJusticeParams) => Promise<UserJustice[]>;
