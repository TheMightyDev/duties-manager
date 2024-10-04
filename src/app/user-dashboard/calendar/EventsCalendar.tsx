"use client";

import { AddPreferenceDialogMode } from "@/app/user-dashboard/calendar/AddPreferenceDialog";
import { AddPreference } from "@/app/user-dashboard/calendar/floating-dialog-contents";
import { FloatingDialog, type FloatingDialogData } from "@/app/user-dashboard/calendar/FloatingDialog";
import { type DatesSelection, type GetPreferenceParams, type PreferenceOperations } from "@/app/user-dashboard/types";
import { type DateSelectArg, type EventClickArg, type EventDropArg, type EventInput } from "@fullcalendar/core/index.js";
import heLocale from "@fullcalendar/core/locales/he";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { type DateClickArg } from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { type Preference, PreferenceImportance, PreferenceReason } from "@prisma/client";
import { add, addMinutes, isSameDay, subMinutes } from "date-fns";
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useImmer } from "use-immer";

interface EventsCalendarProps extends PreferenceOperations<Promise<boolean>> {
	initialPreferences: Preference[];
	fetchPreferences: (params: { userId: string }) => Promise<Preference[]>;
}

export const EventsCalendar: React.FC<EventsCalendarProps> = ({
	initialPreferences,
	fetchPreferences,
	createPreference,
	deletePreference,
	updatePreference,
}) => {
	const [ floatingDialogData, setFloatingDialogData ] = React.useState<FloatingDialogData>({
		isShown: false,
		title: "הוספת הסתייגות",
		widthPx: 300,
		xOffsetPx: 0,
		yOffsetPx: 0,
	});
	const [ dialogMode, setDialogMode ] = React.useState<AddPreferenceDialogMode>(AddPreferenceDialogMode.ADD);
	const [ selectedPreferenceId, setSelectedPreferenceId ] = React.useState<string | null>(null);
	const [ isDialogOpen, setIsDialogOpen ] = React.useState<boolean>(false);
	const [ datesSelection, setDatesSelection ] = React.useState<DatesSelection | null>(null);
	const [ preferences, updatePreferences ] = useImmer<Preference[]>(initialPreferences);
	const [ selectedUserId, setSelectedUserId ] = React.useState<string>("user1");
	const calendarRef = React.useRef<FullCalendar>(null);
	
	const preferenceImportanceEmojis = {
		[PreferenceImportance.ABSENT]: "⛵",
		[PreferenceImportance.HIGH_PRIORITY]: "⚠",
		[PreferenceImportance.NORMAL_PRIORITY]: "",
		[PreferenceImportance.PREFERS_NOT_TO]: "✋",
	} as const satisfies Record<PreferenceImportance, string>;
	
	const preferenceReasonsEmojis = {
		[PreferenceReason.VACATION]: "🌴",
		[PreferenceReason.CELEBRATION]: "🎉",
		[PreferenceReason.FAMILY_EVENT]: "🌆",
		[PreferenceReason.EDUCATION]: "🎓",
		[PreferenceReason.MEDICAL]: "🏥",
		[PreferenceReason.RELIGION]: "🕍",
		[PreferenceReason.APPOINTMENT]: "🩺",
		[PreferenceReason.OTHER]: "📅",
	} as const satisfies Record<PreferenceReason, string>;
	
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
				end: addMinutes(endDate, 1),
				
				className: reason === PreferenceReason.CELEBRATION ? "bg-pink-700 border-pink-900" : "",
				// color: preference.reason === PreferenceReason.CELEBRATION ? "pink" : "",
			}));
		},
		[ preferences ]
	);
	
	const allEvents = React.useMemo(() => {
		if (datesSelection) {
			console.log("datesSelection", datesSelection);
			
			return [
				...preferencesFormattedForEvent,
				{
					id: "placeholder",
					title: "wokie",
					className: "bg-blue-200",
					allDay: true,
					start: datesSelection.start,
					end: addMinutes(datesSelection.end, 1),
				},
			];
		} else {
			return preferencesFormattedForEvent;
		}
	}, [ preferencesFormattedForEvent, datesSelection ]);
	
	const getPreference = ({
		datesSelection: { start, end },
		excludedPreferenceId,
	}: GetPreferenceParams): Preference | undefined => (
		preferences.find((preference) => {
			return (excludedPreferenceId ? preference.id !== excludedPreferenceId : true) && (
				(preference.startDate >= start && preference.startDate < end) ||
				(preference.endDate >= start && preference.endDate < end) ||
				(start >= preference.startDate && end <= preference.endDate));
		})
	);
	
	const createPreferenceWrapper = (newPreference: Preference) => {
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
	};
	
	const deletePreferenceWrapper = (params: { id: string }) => {
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
	};
	
	const updatePreferenceWrapper = (preferenceUpdates: Partial<Preference> & {
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
	};
	
	const dateClickHandler = (arg: DateClickArg) => {
		const datesSelection: DatesSelection = {
			start: arg.date,
			// When we select a dates range in full calendar, the end date is midnight of the next selected date
			end: add(arg.date, {
				days: 1,
				minutes: -1,
			}),
		};
		
		const preferenceInDateRange = getPreference({
			datesSelection,
		});
		
		if (preferenceInDateRange) {
			setSelectedPreferenceId(preferenceInDateRange.id);
			openDialogOnEditMode({
				preferenceId: preferenceInDateRange.id,
			});
		} else {
			setSelectedPreferenceId(null);
			setIsDialogOpen(true);
			setDialogMode(AddPreferenceDialogMode.ADD);
			setDatesSelection(datesSelection);
		}
	};
	const handleDateSelect = (arg: DateSelectArg) => {
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
		
		if (preferenceInDateRange) {
			if (isSameDay(nextDatesSelection.start, nextDatesSelection.end)) {
				// The `dateClick` event and this event are fired simultaneously.
				// If a user just pressed a cell in the calendar,
				// and there's an event in that cell - we will just open
				// the dialog on edit mode, which is handled by the `dateClick` event handler
				return;
			}
			
			setSelectedPreferenceId(preferenceInDateRange.id);
			setIsDialogOpen(false);
			setDatesSelection(null);
			toast.error("כבר הוגשה הסתייגות בטווח התאריכים שנבחר");
		} else {
			// const m = arg.jsEvent?.
			// setSelectedPreferenceId(null);
			// setIsDialogOpen(true);
			// setDialogMode(AddPreferenceDialogMode.ADD);
			
			setDatesSelection(nextDatesSelection);
		}
	};
	
	const openDialogOnEditMode = ({ preferenceId }: { preferenceId: string } ) => {
		setSelectedPreferenceId(preferenceId);
		setDialogMode(AddPreferenceDialogMode.EDIT);
		setIsDialogOpen(true);
		const nextPreference = preferences.find((preference) => preference.id === preferenceId);
		
		setDatesSelection({
			start: nextPreference!.startDate,
			end: nextPreference!.endDate,
		});
	};
	
	const openFloatingDialog = ({ rect }: {
		rect: DOMRect;
	}) => {
		setFloatingDialogData((prev) => {
			// Note that `x` and `y` are the coordinates of the top-left corner
			// By default the dialog opens to the left of the event
			// to adapt to the natural flow of RTL
			let xOffsetPx = rect.x - prev.widthPx;
			// By the default the dialog opens inline with the event
			let yOffsetPx = rect.y;
			
			console.log("@initial xOffsetPx", xOffsetPx, "@rect.x", rect.x);
			
			// If there's isn't place to the left, tries to the right
			if (xOffsetPx < 0) {
				xOffsetPx = rect.x + rect.width;
			}
			
			// If there isn't enough place to the right as well (how sad)
			if (xOffsetPx + prev.widthPx > document.documentElement.clientWidth) {
				// We move the dialog to the left edge, but not sticky
				xOffsetPx = rect.x + rect.width - prev.widthPx;
				// And place it below the element
				yOffsetPx += rect.height;
			}
			
			console.log("@final xOffsetPx", xOffsetPx);

			return {
				...prev,
				isShown: true,
				xOffsetPx,
				yOffsetPx,
			};
		});
	};
	const eventClick = (arg: EventClickArg) => {
		const preferenceId = arg.event.id;
		// openDialogOnEditMode({
		// 	preferenceId,
		// });
		
		const rect = arg.el.getBoundingClientRect();
		openFloatingDialog({
			rect,
		});
	};

	const selectedPreference = preferences.find((preference) => preference.id === selectedPreferenceId);

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
	
	const handleEventDrop = (arg: EventDropArg) => {
		const affectedPreferenceId = arg.event.id;
		const affectedPreferenceIndex = preferences.findIndex((preference) => preference.id === affectedPreferenceId)!;
		const affectedPreference = preferences[affectedPreferenceIndex];
		
		if (arg.event.start && arg.event.end) {
			const nextStartDate = arg.event.start;
			const nextEndDate = subMinutes(arg.event.end, 1);
			if (affectedPreferenceId === "placeholder") {
				setDatesSelection({
					start: nextStartDate,
					end: nextEndDate,
				});
			} else if (affectedPreference) {
				updatePreference({
					id: affectedPreferenceId,
					startDate: nextStartDate,
					endDate: nextEndDate,
				}).then(
					() => {
						toast.success("התאריכים עודכנו בהצלחה");
					},
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
	};
	
	const setIsFloatingDialogShown = (nextIsShown: boolean) => {
		setFloatingDialogData((prev) => ({
			...prev,
			isShown: nextIsShown,
		}));
		
		setDatesSelection(null);
	};

	return (
		<>
			<p>
				<label htmlFor="selected-user-id">User ID </label>
				<input
					value={Number(selectedUserId.replace("user", ""))}
					type="number"
					id="selected-user-id"
					onChange={handleUserIdChange} />
			</p>
			<FullCalendar
				ref={calendarRef}
				editable={true}
				eventOverlap={false}
				eventDrop={handleEventDrop}
				dateClick={dateClickHandler}
				showNonCurrentDates={false}
				locale={heLocale}
				plugins={[ dayGridPlugin, interactionPlugin ]}
				initialView="dayGridMonth"
				selectable={true}
				nextDayThreshold="11:00:00"
				select={handleDateSelect}
				events={allEvents}
				height="70vh"
				eventClick={eventClick}
				eventDidMount={(a) => {
					console.log("@eventDidMount", a.event.id);
					if (a.event.id === "placeholder") {
						a.el.click();
					}
				}}/>
			<FloatingDialog
				{...floatingDialogData}
				setIsShown={setIsFloatingDialogShown}>
				{
					datesSelection &&
					<AddPreference
						isOpen={isDialogOpen}
						userId={selectedUserId}
						datesSelection={datesSelection}
						setDatesSelection={setDatesSelection}
						selectedPreference={selectedPreference}
						getPreference={getPreference}
						createPreference={createPreferenceWrapper}
						deletePreference={deletePreferenceWrapper}
						updatePreference={updatePreferenceWrapper}
						closeDialog={() => {
							setIsDialogOpen(false);
							setDatesSelection(null);
							setIsFloatingDialogShown(false);
						}}/>
				}
				
			</FloatingDialog>
			{/* {
				datesSelection &&
				<AddPreferenceDialog
					mode={dialogMode}
					isOpen={isDialogOpen}
					userId={selectedUserId}
					datesSelection={datesSelection}
					setDatesSelection={setDatesSelection}
					selectedPreference={selectedPreference}
					getPreference={getPreference}
					createPreference={createPreferenceWrapper}
					deletePreference={deletePreferenceWrapper}
					updatePreference={updatePreferenceWrapper}
					closeDialog={() => {
						setIsDialogOpen(false);
						setDatesSelection(null);
					}}/>
			} */}
			
			<ToastContainer
				limit={2}
				rtl={true}
				position="bottom-left"
				toastClassName="bottom-10 md:bottom-0"/>
		</>
	);
};
