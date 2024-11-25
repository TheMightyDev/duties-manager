import { type Period, type User } from "@prisma/client";

export interface ParsedUserAndPeriods {
	user: Omit<User, "id" | "isAdmin" | "organizationId" | "registerDate">;
	periods: (Omit<Period, "id" | "userId">)[];
}

export interface ParseUsersInfoStrReturn {
	errorMessages: string[];
	/** Array of the parsed data of each line, if the parsing failed, the value is `undefined` */
	parsedInfo: (ParsedUserAndPeriods | undefined)[];
}
