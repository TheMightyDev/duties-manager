import { type UserJustice } from "@/server/api/types/user-justice";
import { type UserRole } from "@prisma/client";

export interface FetchUsersJusticeParams {
	roles: UserRole[];
	definitiveDate: Date;
}

export type FetchUsersJusticeFunc = (params: FetchUsersJusticeParams) => Promise<UserJustice[]>;

