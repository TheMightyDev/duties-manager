import { type UserRole } from "@prisma/client";
import { UserRankSchema } from "prisma/generated/zod";
import { z } from "zod";

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

export const formSchema = z.object({
	id: z.string(),
	firstName: z.string().min(2, {
		message: "first name must be at least 2 characters",
	}),
	lastName: z.string().min(2, {
		message: "first name must be at least 2 characters",
	}),
	rank: UserRankSchema,
});
