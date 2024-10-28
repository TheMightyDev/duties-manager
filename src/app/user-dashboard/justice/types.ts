import { type SortUsersJusticeParams } from "@/app/_utils/justice/sort-users-justice";
import { type UserJustice } from "@/types/justice/user-justice";
import { type UserRole } from "@prisma/client";

export interface UsersJusticeTableSettings {
	sortParams: SortUsersJusticeParams;
	fetchParams: FetchUsersJusticeParams;
}

export enum DefinitiveDateKind {
	TODAY = "היום",
	START_OF_CURRENT_MONTH = "תחילת החודש",
	END_OF_CURRENT_MONTH = "סוף החודש",
	CUSTOM = "בהתאמה אישית",
}

export interface FetchUsersJusticeParams {
	roles: UserRole[];
	definitiveDate: Date;
	includeExemptAndAbsentUsers: boolean;
}

export type FetchUsersJusticeFunc = (params: FetchUsersJusticeParams) => Promise<UserJustice[]>;
