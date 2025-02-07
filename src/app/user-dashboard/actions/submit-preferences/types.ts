import { type Period, type Preference } from "@prisma/client";

interface RangeSelection<T> {
	start: T;
	end: T;
}

export type DatesSelection = RangeSelection<Date>;

export interface GetPreferenceParams {
	datesSelection: DatesSelection;
	excludedPreferenceId?: string;
}

export interface PreferenceOperations<ReturnType> {
	createPreference: (newPreference: Preference) => ReturnType;
	deletePreference: (params: { id: string }) => ReturnType;
	updatePreference: (
		updatedPreference: Partial<Preference> & {
			id: string;
		},
	) => ReturnType;
}

export interface EventTaggedUnion {
	kind: EventKind;
	eventData: Preference | Period;
}

export enum EventKind {
	PREFERENCE = "PREFERENCE",
	NEW_PREFERENCE = "NEW_PREFERENCE",
	ABSENCE = "ABSENCE",
	DUTY_ASSIGNMENT = "DUTY_ASSIGNMENT",
	DUTY_RESERVE = "DUTY_RESERVE",
}
