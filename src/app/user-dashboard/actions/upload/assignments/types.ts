import { type User } from "@prisma/client";

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
