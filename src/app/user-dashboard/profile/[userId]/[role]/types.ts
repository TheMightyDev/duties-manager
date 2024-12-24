import { type UserRole } from "@prisma/client";

export interface ProfilePageUrlParamsUnparsed {
	userId: string;
	role: UserRole | "LATEST";
}

export interface ProfilePageUrlParams {
	userId: string;
	role: UserRole;
}

export enum AssignmentsFilterRule {
	ALL = "ALL",
	GUARDING_ONLY = "GUARDING_ONLY",
	CAMP_OR_SETTLEMENT_DEFENSE = "CAMP_OR_SETTLEMENT_DEFENSE",
	MISC_DUTIES = "MISC_DUTIES",
}

