import { type UserRole } from "@prisma/client";

export interface ProfilePageUrlParamsUnparsed {
	userId: string;
	role: UserRole | "LATEST";
}

export interface ProfilePageUrlParams {
	userId: string;
	role: UserRole;
}
