import { type Preference } from "@prisma/client";

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
	updatePreference: (updatedPreference: Partial<Preference> & {
		id: string;
	}) => ReturnType;
}
