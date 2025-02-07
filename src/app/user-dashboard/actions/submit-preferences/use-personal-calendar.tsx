"use client";

import { type FloatingDialogData } from "@/app/_components/floating-dialog/floating-dialog";
import { TrashSvgIcon } from "@/app/_components/svg-icons/ui/trash-svg-icon";
import { calcFloatingDialogLocation } from "@/app/_utils/floating-dialog-utils";
import {
	EventKind,
	type EventTaggedUnion,
} from "@/app/user-dashboard/actions/submit-preferences/types";
import { preferenceImportanceEmojis } from "@/app/user-dashboard/calendar/preference-importance-emojis";
import { preferenceKindsEmojis } from "@/app/user-dashboard/calendar/preference-kinds-emojis";
import {
	type DatesSelection,
	type GetPreferenceParams,
	type PreferenceOperations,
} from "@/app/user-dashboard/types";
import {
	type DateSelectArg,
	type DateSpanApi,
	type DatesSetArg,
	type EventClickArg,
	type EventDropArg,
	type EventInput,
	type EventMountArg,
	type OverlapFunc,
} from "@fullcalendar/core/index.js";
import { type DateClickArg } from "@fullcalendar/interaction";
import { type Period, type Preference } from "@prisma/client";
import { add, addDays, addMinutes, subMinutes } from "date-fns";
import { useTranslations } from "next-intl";
import React, {
	useCallback,
	useEffect,
	useRef,
	useState,
	type ChangeEvent,
} from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useImmer } from "use-immer";

interface RelevantFcEventHandlers {
	eventClick: (arg: EventClickArg) => void;
	dateClick: (arg: DateClickArg) => void;
	selectAllow: (arg: DateSpanApi) => boolean;
	select: (arg: DateSelectArg) => void;
	eventAllow: (arg: DateSpanApi) => boolean;
	eventDrop: (arg: EventDropArg) => void;
	datesSet: (arg: DatesSetArg) => void;
	eventDidMount: (arg: EventMountArg) => void;
	eventOverlap: OverlapFunc;
}

export interface PersonalCalendarProps
	extends PreferenceOperations<Promise<boolean>> {
	initialPreferences: Preference[];
	absences: Period[];
	fetchPreferences: (params: { userId: string }) => Promise<Preference[]>;
}

type Params = PersonalCalendarProps;

interface Return {
	fcEvents: EventInput[];
	fcEventHandlers: RelevantFcEventHandlers;

	/** Wrappers for the CUD (without Read) operations on preferences, that both
	 *
	 * 1. Interact with the DB (the wrappers call these functions)
	 * 2. Manipulate the component's state that mirrors the current preferences (the wrappers add these manipulates)
	 *
	 * The internal state is used to avoid refetching the preferences after every operation
	 */
	preferenceOperationsWrappers: PreferenceOperations<void>;
	getPreference: (params: GetPreferenceParams) => Preference | undefined;

	floatingDialogData: FloatingDialogData;
	setIsFloatingDialogShown: (nextIsShown: boolean) => void;
	isAddPreferenceDialogOpen: boolean;
	proposedEventDatesSelection: DatesSelection | null;
	setProposedEventDatesSelection: React.Dispatch<
		React.SetStateAction<DatesSelection | null>
	>;
	closeAddPreference: () => void;
	selectedPreference: Preference | undefined;

	selectedUserId: string;
	handleUserIdChange: React.ChangeEventHandler<HTMLInputElement>;

	selectedEvent: EventTaggedUnion | null;
	unselectEventAndCloseDialog: () => void;

	floatingDialogRef: React.RefObject<HTMLDivElement>;
}

export function usePersonalCalendar({
	initialPreferences,
	absences,
	fetchPreferences,
	createPreference,
	updatePreference,
	deletePreference,
}: Params): Return {
	const t = useTranslations();
	/**
	 * Mirrors the current preferences in the DB. Updated to avoid refetching after every operation.
	 * We use `useImmer` because it eases updating the array by not creating an entirely new array on each manipulation
	 */
	const [preferences, updatePreferences] =
		useImmer<Preference[]>(initialPreferences);

	const [selectedEvent, setSelectedEvent] = useState<EventTaggedUnion | null>(
		null,
	);

	const [selectedPreferenceId, setSelectedPreferenceId] = useState<
		string | null
	>(null);

	const [clickedEventBoundingClientRect, setClickedEventBoundingClientRect] =
		useState<DOMRect | null>(null);

	/**
	 * If set (not `null`), it means the user selected a date range to potentially add a new preference in that date range.
	 */
	const [proposedEventDatesSelection, setProposedEventDatesSelection] =
		React.useState<DatesSelection | null>(null);

	const [floatingDialogData, setFloatingDialogData] =
		React.useState<FloatingDialogData>({
			isShown: false,
			widthPx: 300,
			xOffsetPx: 0,
			yOffsetPx: 0,
		});
	const [isAddPreferenceDialogOpen, setIsAddPreferenceDialogOpen] =
		React.useState<boolean>(false);

	/** Used for development, so the admin can easily add preferences for different users */
	const [selectedUserId, setSelectedUserId] = React.useState<string>("user1");

	const preferencesFormattedForEvent = React.useMemo(() => {
		return preferences.map<EventInput>(
			({ id, startDate, endDate, importance, description, kind }) => ({
				id: id,
				allDay: true,
				title: `${preferenceKindsEmojis[kind]} ${preferenceImportanceEmojis[importance]} ${description}`,
				start: startDate,
				end: endDate ? addMinutes(endDate, 1) : undefined,

				// TODO: Prevent editing of events that aren't preferences (e.g. duties, absences, reserves and more. Exemptions aren't shown!)
				editable: true,
				durationEditable: false,
				extendedProps: {
					kind: EventKind.PREFERENCE,
				},
			}),
		);
	}, [preferences]);

	const absencesFcEvents = React.useMemo(() => {
		return absences.map<EventInput>((absence) => ({
			id: absence.id,
			title: `${t("User.absence")} - ${absence.description}`,
			className: "bg-blue-200",
			allDay: true,
			start: absence.startDate,
			end: addMinutes(absence.endDate, 1),
			editable: false,
			durationEditable: false,
			extendedProps: {
				kind: EventKind.ABSENCE,
			},
		}));
	}, [absences]);

	const fcEvents = React.useMemo(() => {
		if (proposedEventDatesSelection) {
			console.log("datesSelection", proposedEventDatesSelection);

			return [
				...preferencesFormattedForEvent,
				...absencesFcEvents,
				{
					id: "placeholder",
					title: "Placeholder",
					className: "bg-blue-200",
					color: "pink",
					allDay: true,
					start: proposedEventDatesSelection.start,
					end: addMinutes(proposedEventDatesSelection.end, 1),
					editable: false,
					extendedProps: {
						kind: EventKind.NEW_PREFERENCE,
					},
				},
			];
		} else {
			return [...preferencesFormattedForEvent, ...absencesFcEvents];
		}
	}, [preferencesFormattedForEvent, proposedEventDatesSelection]);

	const getPreference = ({
		datesSelection: { start, end },
		excludedPreferenceId,
	}: GetPreferenceParams): Preference | undefined => {
		return preferences.find((preference) => {
			if (excludedPreferenceId && preference.id === excludedPreferenceId) {
				return false;
			}

			// if (
			// 	(!findEaseGuarding && preference.importance === PreferenceImportance.EASE_GUARDING) ||
			// 	(findEaseGuarding && preference.importance !== PreferenceImportance.EASE_GUARDING)
			// ) {
			// 	return false;
			// }

			// Preferences may not have an end date, because they're permanent exemptions.
			// We want to ignore them, because we only look at actual preferences submitted by user (or absences)
			if (preference.endDate) {
				return (
					(preference.startDate >= start && preference.startDate < end) ||
					(preference.endDate >= start && preference.endDate < end) ||
					(start >= preference.startDate && end <= preference.endDate)
				);
			}
		});
	};

	const preferenceOperationsWrappers: PreferenceOperations<void> = {
		createPreference: (newPreference: Preference) => {
			createPreference(newPreference).then(
				() => {
					toast.success("ההסתייגות הוגשה בהצלחה");
					updatePreferences((draft) => {
						draft.push(newPreference);
					});
					setProposedEventDatesSelection(null);
				},
				() => {
					toast.error("הגשת ההסתייגות נכשלה");
				},
			);
		},
		updatePreference: (
			preferenceUpdates: Partial<Preference> & {
				id: string;
			},
		) => {
			updatePreference(preferenceUpdates).then(
				() => {
					toast.success("ההסתייגות עודכנה בהצלחה");
					updatePreferences((draft) => {
						const index = draft.findIndex(
							(preference) => preference.id === preferenceUpdates.id,
						);

						if (draft[index]) {
							draft[index] = {
								...draft[index],
								...preferenceUpdates,
							};
						}
					});
				},
				() => {
					toast.error("עדכון ההסתייגות נכשל");
				},
			);
		},
		deletePreference: (params: { id: string }) => {
			deletePreference(params).then(
				() => {
					toast.success("ההסתייגות נמחקה בהצלחה", {
						icon: (
							<div className="rounded-full bg-green-500 p-1">
								<TrashSvgIcon className="size-5 stroke-white" />
							</div>
						),
					});
					updatePreferences((draft) => {
						const deletedPreferenceIndex = draft.findIndex(
							(preference) => preference.id === params.id,
						);

						// Note: `splice` mutates the original array
						draft.splice(deletedPreferenceIndex, 1);
					});
				},
				() => {
					toast.error("מחיקת ההסתייגות נכשלה");
				},
			);
		},
	};

	const openFloatingDialog = useCallback(({ rect }: { rect: DOMRect }) => {
		setFloatingDialogData((prev) => {
			return {
				...prev,
				isShown: true,
				...calcFloatingDialogLocation({
					eventMarkRect: rect,
					floatingDialogRect:
						floatingDialogRef.current?.getBoundingClientRect(),
				}),
			};
		});
	}, []);

	useEffect(() => {
		if (!clickedEventBoundingClientRect) return;

		openFloatingDialog({ rect: clickedEventBoundingClientRect });
	}, [clickedEventBoundingClientRect]);

	const selectedPreference = preferences.find(
		(preference) => preference.id === selectedPreferenceId,
	);

	function setIsFloatingDialogShown(nextIsShown: boolean) {
		setFloatingDialogData((prev) => ({
			...prev,
			isShown: nextIsShown,
		}));
		setProposedEventDatesSelection(null);
	}

	const unselectEventAndCloseDialog = () => {
		setSelectedEvent(null);
		setIsFloatingDialogShown(false);
	};

	function closeAddPreference() {
		setIsAddPreferenceDialogOpen(false);
		setProposedEventDatesSelection(null);
		setIsFloatingDialogShown(false);
	}

	function handleUserIdChange(event: ChangeEvent<HTMLInputElement>) {
		const nextUserId = "user" + event.target.value;
		setSelectedUserId(nextUserId);

		fetchPreferences({
			userId: nextUserId,
		}).then((result) => {
			updatePreferences((draft) => {
				draft.length = 0;
				draft.push(...result);
			});
		});
	}

	const eventsByKind = {
		[EventKind.PREFERENCE]: preferences,
		[EventKind.ABSENCE]: absences,
		[EventKind.DUTY_ASSIGNMENT]: preferences,
		[EventKind.DUTY_RESERVE]: preferences,
		[EventKind.NEW_PREFERENCE]: preferences,
	} as const satisfies Record<
		EventKind,
		{
			id: string;
		}[]
	>;
	const fcEventHandlers: RelevantFcEventHandlers = {
		dateClick: (arg: DateClickArg) => {
			if (arg.date <= addDays(new Date(), 1)) {
				return;
			}
			const nextDatesSelection: DatesSelection = {
				start: arg.date,
				// When we select a dates range in full calendar, the end date is midnight of the next selected date
				end: add(arg.date, {
					days: 1,
					minutes: -1,
				}),
			};

			const preferenceInDateRange = getPreference({
				datesSelection: nextDatesSelection,
			});

			if (!preferenceInDateRange) {
				setSelectedPreferenceId(null);
				setIsAddPreferenceDialogOpen(true);
				setProposedEventDatesSelection(nextDatesSelection);
			}
		},
		selectAllow: (span: DateSpanApi): boolean => {
			const existingPreference = getPreference({
				datesSelection: {
					start: span.start,
					end: span.end,
				},
			});

			if (existingPreference) {
				return false;
			} else {
				return span.start > addDays(new Date(), 1);
			}
		},
		select: (arg: DateSelectArg) => {
			setFloatingDialogData((prev) => ({
				...prev,
				isShown: false,
			}));
			setSelectedEvent(null);
			const nextDatesSelection: DatesSelection = {
				start: arg.start,
				// When we select a dates range in full calendar, the end date is midnight of the next selected date
				end: subMinutes(arg.end, 1),
			};

			setIsAddPreferenceDialogOpen(true);
			setIsFloatingDialogShown(true);

			setProposedEventDatesSelection(nextDatesSelection);
		},
		eventClick: (arg: EventClickArg) => {
			const clickedEventId = arg.event.id as string;
			const clickedEventKind = arg.event.extendedProps.kind as EventKind;

			if (clickedEventKind !== EventKind.NEW_PREFERENCE) {
				setProposedEventDatesSelection(null);
				const eventsOfKind = eventsByKind[clickedEventKind];

				const clickedEventData = eventsOfKind.find(
					(event) => event.id === clickedEventId,
				);

				if (clickedEventData) {
					setSelectedEvent({
						kind: clickedEventKind,
						eventData: clickedEventData,
					});
				}
			}

			/** The floating dialog opens later, in an effect, after the height was calculated */
			const rect = arg.el.getBoundingClientRect();
			setClickedEventBoundingClientRect(rect);
		},
		eventAllow: (dropInfo: DateSpanApi): boolean => {
			return dropInfo.start > addDays(new Date(), 1);
		},
		eventDrop: (arg: EventDropArg) => {
			const affectedPreferenceId = arg.event.id;
			const affectedPreferenceIndex = preferences.findIndex(
				(preference) => preference.id === affectedPreferenceId,
			)!;
			const affectedPreference = preferences[affectedPreferenceIndex];

			if (arg.event.start && arg.event.end) {
				const nextStartDate = arg.event.start;
				const nextEndDate = subMinutes(arg.event.end, 1);
				if (affectedPreferenceId === "placeholder") {
					setProposedEventDatesSelection({
						start: nextStartDate,
						end: nextEndDate,
					});
				} else if (affectedPreference) {
					updatePreference({
						id: affectedPreferenceId,
						startDate: nextStartDate,
						endDate: nextEndDate,
					}).catch(() => {
						toast.error("עדכון התאריכים נכשל");
					});
				}

				updatePreferences((draft) => {
					const affected = draft[affectedPreferenceIndex];

					if (affected && arg.event.start && arg.event.end) {
						affected.startDate = arg.event.start;
						affected.endDate = subMinutes(arg.event.end, 1);
					}
				});

				// If the dropped event is the selected event
				if (arg.event.id === selectedEvent?.eventData.id) {
					setSelectedEvent(null);
				}
			}
		},
		eventDidMount: (arg: EventMountArg) => {
			if (arg.event.id === "placeholder") {
				// A trick to trigger opening the floating dialog
				arg.el.click();
			}
		},
		datesSet: () => {
			// This event fires when the user changes the view in the calendar (navigates to a different month)
			setProposedEventDatesSelection(null);
			setIsFloatingDialogShown(false);
		},
		eventOverlap: (stillEvent) => {
			// TODO: Perhaps we should show exemptions on the calendar?
			return;
			// const stillPreference = preferences.find((preference) => preference.id === stillEvent.id);

			// if (stillPreference) {
			// 	return stillPreference.kind === PreferenceReason.EXEMPTION;
			// }

			// return false;
		},
	};

	const floatingDialogRef = useRef<HTMLDivElement>(null);

	return {
		fcEvents,
		fcEventHandlers,

		preferenceOperationsWrappers,
		getPreference,

		floatingDialogData,
		setIsFloatingDialogShown,
		isAddPreferenceDialogOpen,
		proposedEventDatesSelection,
		setProposedEventDatesSelection,
		closeAddPreference,
		selectedPreference,

		selectedUserId,
		handleUserIdChange,

		selectedEvent,
		unselectEventAndCloseDialog,

		floatingDialogRef,
	};
}
