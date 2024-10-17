import { type FloatingDialogData } from "@/app/_components/floating-dialog/floating-dialog";
import { calcFloatingDialogLocation } from "@/app/_utils/floating-dialog-utils";
import { preferenceImportanceEmojis } from "@/app/user-dashboard/calendar/preference-importance-emojis";
import { preferenceReasonsEmojis } from "@/app/user-dashboard/calendar/preference-reasons-emojis";
import { type DatesSelection, type GetPreferenceParams, type PreferenceOperations } from "@/app/user-dashboard/types";
import { type DateSelectArg, type DateSpanApi, type DatesSetArg, type EventClickArg, type EventDropArg, type EventInput, type EventMountArg, type OverlapFunc } from "@fullcalendar/core/index.js";
import { type DateClickArg } from "@fullcalendar/interaction";
import { type Preference, PreferenceImportance, PreferenceReason } from "@prisma/client";
import { add, addDays, addMinutes, subMinutes } from "date-fns";
import React from "react";
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

export interface PreferencesCalendarProps extends PreferenceOperations<Promise<boolean>> {
	initialPreferences: Preference[];
	fetchPreferences: (params: { userId: string }) => Promise<Preference[]>;
}

type Params = PreferencesCalendarProps;

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
	setProposedEventDatesSelection: React.Dispatch<React.SetStateAction<DatesSelection | null>>;
	closeAddPreference: () => void;
	selectedPreference: Preference | undefined;
	
	selectedUserId: string;
	handleUserIdChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const usePreferencesCalendar = ({
	initialPreferences,
	fetchPreferences,
	createPreference,
	updatePreference,
	deletePreference,
}: Params): Return => {
	/**
	 * Mirrors the current preferences in the DB. Updated to avoid refetching after every operation.
	 * We use `useImmer` because it eases updating the array by not creating an entirely new array on each manipulation
	*/
	const [ preferences, updatePreferences ] = useImmer<Preference[]>(initialPreferences);

	const [ selectedPreferenceId, setSelectedPreferenceId ] = React.useState<string | null>(null);
	
	/**
	 * If set (not `null`), it means the user selected a date range to potentially add a new preference in that date range.
	 */
	const [ proposedEventDatesSelection, setProposedEventDatesSelection ] = React.useState<DatesSelection | null>(null);
	
	const [ floatingDialogData, setFloatingDialogData ] = React.useState<FloatingDialogData>({
		isShown: false,
		widthPx: 300,
		xOffsetPx: 0,
		yOffsetPx: 0,
	});
	const [ isAddPreferenceDialogOpen, setIsAddPreferenceDialogOpen ] = React.useState<boolean>(false);
	
	/** Used for development, so the admin can easily add preferences for different users */
	const [ selectedUserId, setSelectedUserId ] = React.useState<string>("user1");
	
	const preferencesFormattedForEvent = React.useMemo(
		() => {
			return preferences.map<EventInput>(({
				id,
				startDate,
				endDate,
				importance,
				description,
				reason,
			}) => ({
				id: id,
				allDay: true,
				title: `${preferenceReasonsEmojis[reason]} ${preferenceImportanceEmojis[importance]} ${description}`,
				start: startDate,
				end: endDate ? addMinutes(endDate, 1) : undefined,
				
				color: reason === PreferenceReason.EXEMPTION ? "#ea75b7" : "",
				// color: preference.reason === PreferenceReason.CELEBRATION ? "pink" : "",
				editable: reason !== PreferenceReason.EXEMPTION,
			}));
		},
		[ preferences ]
	);
	
	const fcEvents = React.useMemo(() => {
		if (proposedEventDatesSelection) {
			console.log("datesSelection", proposedEventDatesSelection);
			
			return [
				...preferencesFormattedForEvent,
				{
					id: "placeholder",
					title: "Placeholder",
					className: "bg-blue-200",
					color: "pink",
					allDay: true,
					start: proposedEventDatesSelection.start,
					end: addMinutes(proposedEventDatesSelection.end, 1),
				},
			];
		} else {
			return preferencesFormattedForEvent;
		}
	}, [ preferencesFormattedForEvent, proposedEventDatesSelection ]);
	
	const getPreference = ({
		datesSelection: { start, end },
		excludedPreferenceId,
		findEaseGuarding = false,
	}: GetPreferenceParams): Preference | undefined => (
		preferences.find((preference) => {
			if (excludedPreferenceId && preference.id === excludedPreferenceId) {
				return false;
			}
			
			if (
				(!findEaseGuarding && preference.importance === PreferenceImportance.EASE_GUARDING) ||
				(findEaseGuarding && preference.importance !== PreferenceImportance.EASE_GUARDING)
			) {
				return false;
			}
			
			// Preferences may not have an end date, because they're permanent exemptions.
			// We want to ignore them, because we only look at actual preferences submitted by user (or absences)
			if (preference.endDate) {
				return (
					(preference.startDate >= start && preference.startDate < end) ||
					(preference.endDate >= start && preference.endDate < end) ||
					(start >= preference.startDate && end <= preference.endDate)
				);
			}
		})
	);
	
	const preferenceOperationsWrappers: PreferenceOperations<void> = {
		createPreference: (newPreference: Preference) => {
			createPreference(newPreference).then(
				() => {
					toast.success("ההסתייגות הוגשה בהצלחה");
					updatePreferences((draft) => {
						draft.push(newPreference);
					});
				},
				() => {
					toast.error("הגשת ההסתייגות נכשלה");
				}
			);
		},
		updatePreference: (preferenceUpdates: Partial<Preference> & {
			id: string;
		}) => {
			updatePreference(preferenceUpdates).then(
				() => {
					toast.success("ההסתייגות עודכנה בהצלחה");
					updatePreferences((draft) => {
						const index = draft.findIndex((preference) => preference.id === preferenceUpdates.id);
						
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
				}
			);
		},
		deletePreference: (params: { id: string }) => {
			deletePreference(params).then(
				() => {
					toast.success("ההסתייגות נמחקה בהצלחה");
					updatePreferences((draft) => {
						const deletedPreferenceIndex = draft.findIndex((preference) => preference.id === params.id);
						
						// Note: `splice` mutates the original array
						draft.splice(deletedPreferenceIndex, 1);
					});
				},
				() => {
					toast.error("מחיקת ההסתייגות נכשלה");
				}
			);
		},
	};
	
	const openFloatingDialog = ({ rect }: {
		rect: DOMRect;
	}) => {
		setFloatingDialogData((prev) => {
			return {
				...prev,
				isShown: true,
				...calcFloatingDialogLocation({
					rect,
					dialogWidthPx: prev.widthPx,
				}),
			};
		});
	};
	
	const selectedPreference = preferences.find((preference) => preference.id === selectedPreferenceId);
	
	const setIsFloatingDialogShown = (nextIsShown: boolean) => {
		setFloatingDialogData((prev) => ({
			...prev,
			isShown: nextIsShown,
		}));
		setProposedEventDatesSelection(null);
	};
		
	const closeAddPreference = () => {
		setIsAddPreferenceDialogOpen(false);
		setProposedEventDatesSelection(null);
		setIsFloatingDialogShown(false);
	};
	
	const handleUserIdChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
		const nextUserId = "user" + event.target.value;
		setSelectedUserId(nextUserId);
		
		fetchPreferences({
			userId: nextUserId,
		}).then(
			(result) => {
				updatePreferences((draft) => {
					draft.length = 0;
					draft.push(...result);
				});
			}
		);
	};
	
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
				findEaseGuarding: false,
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
			
			const preferenceInDateRange = getPreference({
				datesSelection: nextDatesSelection,
			});
			
			// if (preferenceInDateRange) {
			// 	// setSelectedPreferenceId(preferenceInDateRange.id);
			// 	// toast.error("כבר הוגשה הסתייגות בטווח התאריכים שנבחר");
			// 	// setProposedEventDatesSelection(null);
			// } else {
			setIsAddPreferenceDialogOpen(true);
			setIsFloatingDialogShown(true);
				
			setProposedEventDatesSelection(nextDatesSelection);
			// }
		},
		eventClick: (arg: EventClickArg) => {
			const preferenceId = arg.event.id;
			setFloatingDialogData((prev) => ({
				...prev,
				title: "עריכת הסתייגות",
			}));
			if (preferenceId !== "placeholder") {
				setProposedEventDatesSelection(null);
			}
			setSelectedPreferenceId(preferenceId);
			
			const rect = arg.el.getBoundingClientRect();
			openFloatingDialog({
				rect,
			});
		},
		eventAllow: (dropInfo: DateSpanApi): boolean => {
			return dropInfo.start > addDays(new Date(), 1);
		},
		eventDrop: (arg: EventDropArg) => {
			const affectedPreferenceId = arg.event.id;
			const affectedPreferenceIndex = preferences.findIndex((preference) => preference.id === affectedPreferenceId)!;
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
					}).catch(
						() => {
							toast.error("עדכון התאריכים נכשל");
						}
					);
				}
				
				updatePreferences((draft) => {
					const affected = draft[affectedPreferenceIndex];
					
					if (affected && arg.event.start && arg.event.end) {
						affected.startDate = arg.event.start;
						affected.endDate = subMinutes(arg.event.end, 1);
					}
				});
			}
		},
		eventDidMount: (arg: EventMountArg) => {
			if (arg.event.id === "placeholder") {
				arg.el.click();
			}
		},
		datesSet: () => {
			// This event fires when the user changes the view in the calendar (navigates to a different month)
			setProposedEventDatesSelection(null);
			setIsFloatingDialogShown(false);
		},
		eventOverlap: (stillEvent) => {
			const stillPreference = preferences.find((preference) => preference.id === stillEvent.id);
			
			if (stillPreference) {
				return stillPreference.reason === PreferenceReason.EXEMPTION;
			}
			
			return false;
		},
	};
	
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
	};
};
