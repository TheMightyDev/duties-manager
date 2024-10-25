import { type UserJustice } from "@/app/_types/justice/user-justice";
import { type UserRole } from "@prisma/client";

export interface FetchUsersJusticeParams {
	roles: UserRole[];
	definitiveDate: Date;
	includeExemptAndAbsentUsers: boolean;
}

export type FetchUsersJusticeFunc = (params: FetchUsersJusticeParams) => Promise<UserJustice[]>;
