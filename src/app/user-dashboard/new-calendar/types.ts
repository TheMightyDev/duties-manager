import { type UserWithAllEvents } from "@/server/api/types/user-with-all-events";
import { type Preference } from "@prisma/client";

export interface PreferenceOperations<ReturnType> {
	createPreference: (newPreference: Preference) => ReturnType;
	deletePreference: (params: { id: string }) => ReturnType;
	updatePreference: (updatedPreference: Partial<Preference> & {
		id: string;
	}) => ReturnType;
}

export interface UserCalendarProps extends PreferenceOperations<Promise<boolean>> {
	initialUserWithAllEvents: UserWithAllEvents;
	/** Used by admin to switch which user is viewed */
	fetchUserWithAllEventsById: (userId: string) => Promise<UserWithAllEvents | null>;
}

export enum EventKind {
	Assignment,
	Reserve,
	Preference,
	TemporaryAbsence,
	TemporaryExempt,
}

/** Describes a single event out of multiple kinds of events dealt with
 * in the user calendar. Just `id` alone isn't enough, because we have
 * to search it in multiple event sources (assignments, preferences etc.)
 */
export interface CalendarEventId {
	id: string;
	kind: EventKind;
}
