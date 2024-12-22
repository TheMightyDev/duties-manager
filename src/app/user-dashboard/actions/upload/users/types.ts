import { type Period, type User } from "@prisma/client";

export interface ParsedUserAndPeriods {
	user: Omit<User, "id" | "isAdmin" | "organizationId" | "registerDate" | "adminNote">;
	periods: (Omit<Period, "id" | "userId">)[];
}

export interface UsersUploadCounts {
	users: number;
	periods: number;
}
