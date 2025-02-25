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
import {
	PreferenceImportance,
	PreferenceKind,
	type Period,
	type Preference,
	type User,
} from "@prisma/client";
import { add, addDays, addMinutes, subMinutes } from "date-fns";
import { useTranslations } from "next-intl";
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
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
	userId: User["id"];
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
	recalculateFloatingDialogPosition: () => void;

	selectedEvent: EventTaggedUnion | null;
	updateSelectedPreferenceDatesSelection: (
		nextDatesSelection: Partial<DatesSelection>,
	) => void;
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

	const [clickedEventElementBoundingRect, setClickedEventElementBoundingRect] =
		useState<DOMRect | null>(null);

	const [floatingDialogData, setFloatingDialogData] =
		React.useState<FloatingDialogData>({
			isShown: false,
			widthPx: 300,
			xOffsetPx: 0,
			yOffsetPx: 0,
		});

	const defaultPreference = useMemo(
		() =>
			({
				id: "new-preference",
				userId: "",
				importance: PreferenceImportance.CANT,
				kind: PreferenceKind.CELEBRATION,
				description: "",
			}) as const satisfies Partial<Preference>,
		[],
	);

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
		if (selectedEvent?.kind === EventKind.NEW_PREFERENCE) {
			return [
				...preferencesFormattedForEvent,
				...absencesFcEvents,
				{
					id: "placeholder",
					title: "Placeholder",
					className: "bg-blue-200",
					color: "pink",
					allDay: true,
					start: selectedEvent.eventData.startDate,
					end: addMinutes(selectedEvent.eventData.endDate, 1),
					editable: false,
					extendedProps: {
						kind: EventKind.NEW_PREFERENCE,
					},
				},
			];
		} else {
			return [...preferencesFormattedForEvent, ...absencesFcEvents];
		}
	}, [preferencesFormattedForEvent, selectedEvent]);

	const updateSelectedPreferenceDatesSelection = (
		nextDatesSelection: Partial<DatesSelection>,
	) => {
		setSelectedEvent((prev) =>
			prev &&
			(prev.kind === EventKind.NEW_PREFERENCE ||
				prev.kind === EventKind.PREFERENCE)
				? {
						kind: prev.kind,
						eventData: {
							...prev.eventData,
							startDate: nextDatesSelection.start ?? prev.eventData.startDate,
							endDate: nextDatesSelection.end ?? prev.eventData.endDate,
						},
					}
				: null,
		);
	};
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

	const addMirroredPreference = (preference: Preference) => {
		updatePreferences((draft) => {
			draft.push(preference);
		});
	};

	const deleteMirroredPreference = ({ id }: { id: string }) => {
		updatePreferences((draft) => {
			const deletedPreferenceIndex = draft.findIndex(
				(preference) => preference.id === id,
			);

			// Note: `splice` mutates the original array
			draft.splice(deletedPreferenceIndex, 1);
		});
	};

	const updateMirroredPreference = (
		preferenceUpdates: Partial<Preference> & {
			id: string;
		},
	) => {
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
	};
	const preferenceOperationsWrappers: PreferenceOperations<void> = {
		createPreference: (newPreference: Preference) => {
			addMirroredPreference(newPreference);
			unselectEventAndCloseDialog();
			toast
				.promise(createPreference(newPreference), {
					pending: t("PersonalCalendar.ToastMessages.submitProgress"),
					success: t("PersonalCalendar.ToastMessages.submitSuccess"),
					error: t("PersonalCalendar.ToastMessages.submitFailure"),
				})
				.catch(() => {
					deleteMirroredPreference({ id: newPreference.id });
				});
		},
		updatePreference: (
			preferenceUpdates: Partial<Preference> & {
				id: string;
			},
		) => {
			const originalPreference = preferences.find(
				(curr) => curr.id === preferenceUpdates.id,
			);
			if (!originalPreference) {
				toast.error(t("PersonalCalendar.ToastMessages.updateFailure"));

				return;
			}
			updateMirroredPreference(preferenceUpdates);
			toast
				.promise(updatePreference(preferenceUpdates), {
					pending: t("PersonalCalendar.ToastMessages.updateProgress"),
					success: t("PersonalCalendar.ToastMessages.updateSuccess"),
					error: t("PersonalCalendar.ToastMessages.updateFailure"),
				})
				.catch(() => {
					updateMirroredPreference(originalPreference);
				});
		},
		deletePreference: (params: { id: string }) => {
			const deletedPreferenceIndex = preferences.findIndex(
				(preference) => preference.id === params.id,
			);
			const deletedPreference = preferences[deletedPreferenceIndex];
			if (!deletedPreference) {
				toast.error("PersonalCalendar.ToastMessages.deleteFailure");

				return;
			}
			deleteMirroredPreference(params);
			toast
				.promise(deletePreference(params), {
					pending: t("PersonalCalendar.ToastMessages.deleteProgress"),
					success: {
						render: () => {
							return t("PersonalCalendar.ToastMessages.deleteSuccess");
						},
						icon: (
							<div className="rounded-full bg-green-500 p-1">
								<TrashSvgIcon className="size-5 stroke-white" />
							</div>
						),
					},
					error: t("PersonalCalendar.ToastMessages.deleteFailure"),
				})
				.catch(() => {
					addMirroredPreference(deletedPreference);
				});
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

	const recalculateFloatingDialogPosition = () => {
		console.log(
			"@ClickedEventElementBoundingRect",
			clickedEventElementBoundingRect,
		);

		setClickedEventElementBoundingRect((prev) => {
			if (prev) {
				console.log("@prev", prev);

				return DOMRect.fromRect(prev);
			} else {
				return null;
			}
		});
		console.log("@recalculate...");
	};

	useEffect(() => {
		if (!clickedEventElementBoundingRect) return;
		console.log("@repositioning", clickedEventElementBoundingRect);

		openFloatingDialog({ rect: clickedEventElementBoundingRect });
	}, [clickedEventElementBoundingRect]);

	function setIsFloatingDialogShown(nextIsShown: boolean) {
		setFloatingDialogData((prev) => ({
			...prev,
			isShown: nextIsShown,
		}));
	}

	const unselectEventAndCloseDialog = () => {
		setSelectedEvent(null);
		setIsFloatingDialogShown(false);
	};

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
				setSelectedEvent({
					kind: EventKind.NEW_PREFERENCE,
					eventData: {
						...defaultPreference,
						startDate: nextDatesSelection.start,
						endDate: nextDatesSelection.end,
					},
				});
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
			const nextDatesSelection: DatesSelection = {
				start: arg.start,
				// When we select a dates range in full calendar, the end date is midnight of the next selected date
				end: subMinutes(arg.end, 1),
			};

			setIsFloatingDialogShown(true);
			setSelectedEvent({
				kind: EventKind.NEW_PREFERENCE,
				eventData: {
					...defaultPreference,
					endDate: nextDatesSelection.end,
					startDate: nextDatesSelection.start,
				},
			});
		},
		eventClick: (arg: EventClickArg) => {
			const clickedEventId = arg.event.id as string;
			const clickedEventKind = arg.event.extendedProps.kind as EventKind;

			if (clickedEventKind !== EventKind.NEW_PREFERENCE) {
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

			// The floating dialog opens later, in an effect, after the height was calculated
			const rect = arg.el.getBoundingClientRect();
			setClickedEventElementBoundingRect(rect);
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
				if (affectedPreference) {
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
			if (
				(arg.event.extendedProps.kind as EventKind) === EventKind.NEW_PREFERENCE
			) {
				// A trick to trigger opening the floating dialog
				arg.el.click();
			}
		},
		datesSet: () => {
			// This event fires when the user changes the view in the calendar (navigates to a different month)
			setSelectedEvent(null);
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
		recalculateFloatingDialogPosition,

		selectedEvent,
		updateSelectedPreferenceDatesSelection,
		unselectEventAndCloseDialog,

		floatingDialogRef,
	};
}
