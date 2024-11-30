import { type Period, type User } from "@prisma/client";

export interface ParsedUserAndPeriods {
	user: Omit<User, "id" | "isAdmin" | "organizationId" | "registerDate">;
	periods: (Omit<Period, "id" | "userId">)[];
}

export interface ParseUsersInfoStrReturn {
	errorMessages: string[];
	/** Array of the parsed data of each line, if the parsing failed, the value is `undefined` */
	parsedInfoJson: string;
}

export interface UploadCounts {
	users: number;
	periods: number;
}

export interface ParsedAssignment {
	startDateStr: string;
	durationInDays: 1 | 2 | 3;
	assigneeFullName: string;
	assigneeId: User["id"];
	reserveFullName?: string;
	reserveId?: User["id"];
	extraScore?: number;
	note?: string;
}
