import { type UserRole } from "@prisma/client";

export interface ProfilePageUrlParams {
	userId: string;
	role: UserRole | "LATEST";
}
