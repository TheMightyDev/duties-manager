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
