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

export type PreferenceTagged = {
	kind: EventKind.PREFERENCE;
	eventData: Preference;
};

export type EventTaggedUnion =
	| PreferenceTagged
	| {
			kind: EventKind.NEW_PREFERENCE;
			eventData: Preference;
	  }
	| {
			kind: EventKind.ABSENCE;
			eventData: Period;
	  };

export enum EventKind {
	PREFERENCE = "PREFERENCE",
	NEW_PREFERENCE = "NEW_PREFERENCE",
	ABSENCE = "ABSENCE",
	DUTY_ASSIGNMENT = "DUTY_ASSIGNMENT",
	DUTY_RESERVE = "DUTY_RESERVE",
}
