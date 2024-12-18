import { type Assignment, type Duty, type UserRole } from "@prisma/client";

export interface ValidateUploadedInfoParams {
	infoStr: string;
	userRole: UserRole;
}

export interface ParsedAssignment {
	assigneeFullName: string;
	reserveFullName?: string;
	extraScore?: number;
	note?: string;
}

type DutyDateAndDuration = string;

export type ParsedDutiesAssignments = Record<DutyDateAndDuration, ParsedAssignment[]>;

export interface AssignmentsUploadCounts {
	duties: number;
	assignments: number;
}

export interface UploadableDutiesAndAssignments {
	duties: Duty[];
	assignments: Assignment[];
}
