import { type Assignment, type Duty } from "@prisma/client";

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
