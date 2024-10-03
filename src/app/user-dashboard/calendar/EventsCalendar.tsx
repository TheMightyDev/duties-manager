"use client";

import { AddPreferenceDialog, AddPreferenceDialogMode } from "@/app/user-dashboard/calendar/AddPreferenceDialog";
import { type DatesSelection, type GetPreferenceParams, type PreferenceOperations } from "@/app/user-dashboard/types";
import { type DateSelectArg, type EventClickArg, type EventContentArg, type EventInput } from "@fullcalendar/core/index.js";
import heLocale from "@fullcalendar/core/locales/he";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { type Preference, PreferenceReason } from "@prisma/client";
import { addMinutes, subMinutes } from "date-fns";
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
	const [ dialogMode, setDialogMode ] = React.useState<AddPreferenceDialogMode>(AddPreferenceDialogMode.ADD);
	const [ selectedPreferenceId, setSelectedPreferenceId ] = React.useState<string | null>(null);
	const [ isDialogOpen, setIsDialogOpen ] = React.useState<boolean>(false);
	const [ datesSelection, setDatesSelection ] = React.useState<DatesSelection | null>(null);
	const [ preferences, updatePreferences ] = useImmer<Preference[]>(initialPreferences);
	const [ selectedUserId, setSelectedUserId ] = React.useState<string>("user1");
	
	const preferencesFormattedForEvent = React.useMemo(
		() => {
			console.log("@preferences", preferences);
			
			return preferences.map<EventInput>((preference) => ({
				id: preference.id,
				allDay: true,
				title: preference.description,
				start: preference.startDate,
				end: addMinutes(preference.endDate, 1),
				
				className: preference.reason === PreferenceReason.CELEBRATION ? "bg-pink-700 border-pink-900" : "",
				// color: preference.reason === PreferenceReason.CELEBRATION ? "pink" : "",
			}));
		},
		[ preferences ]
	);
	
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
	
	const updatePreferenceWrapper = (preferenceWithUpdates: Preference) => {
		updatePreference(preferenceWithUpdates).then(
			() => {
				toast.success("ההסתייגות עודכנה בהצלחה");
				updatePreferences((draft) => {
					const index = draft.findIndex((preference) => preference.id === preferenceWithUpdates.id);
					
					draft[index] = preferenceWithUpdates;
				});
			},
			() => {
				toast.error("עדכון ההסתייגות נכשל");
			}
		);
	};
	
	const dateSelectHandler = (arg: DateSelectArg) => {
		console.log("@selected", arg);
		
		const datesSelection: DatesSelection = {
			start: arg.start,
			// When we select a dates range in full calendar, the end date is midnight of the next selected date
			end: subMinutes(arg.end, 1),
		};
		
		const preferenceInDateRange = getPreference({
			datesSelection,
		});
		
		console.log("@preferenceInDateRange", preferenceInDateRange);
		if (preferenceInDateRange) {
			setSelectedPreferenceId(preferenceInDateRange.id);
			setIsDialogOpen(false);
			setDatesSelection(null);
			toast.error("כבר הוגשה הסתייגות בטווח התאריכים שנבחר", {
				rtl: true,
			});
		} else {
			setSelectedPreferenceId(null);
			setIsDialogOpen(true);
			setDialogMode(AddPreferenceDialogMode.ADD);
			setDatesSelection(datesSelection);
		}
	};
	
	const eventClick = (arg: EventClickArg) => {
		const m = arg.event.id;
		setSelectedPreferenceId(m);
		setDialogMode(AddPreferenceDialogMode.EDIT);
		setIsDialogOpen(true);
		const nextPreference = preferences.find((preference) => preference.id === m);

		setDatesSelection({
			start: nextPreference!.startDate,
			end: nextPreference!.endDate,
		});
		console.log("@eventClick", arg.event);
	};

	const selectedPreference = preferences.find((preference) => preference.id === selectedPreferenceId);

	const handleUserIdChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
		const nextUserId = "user" + event.target.value;
		setSelectedUserId(nextUserId);
		console.log("@nextUserId", nextUserId);
		
		fetchPreferences({
			userId: nextUserId,
		}).then(
			(result) => {
				console.log("@result", result);
				
				updatePreferences((draft) => {
					draft.length = 0;
					draft.push(...result);
				});
			}
		);
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
				showNonCurrentDates={false}
				locale={heLocale}
				plugins={[ dayGridPlugin, interactionPlugin ]}
				initialView="dayGridMonth"
				selectable={true}
				nextDayThreshold="11:00:00"
				select={dateSelectHandler}
				eventContent={renderEventContent}
				events={[
					...preferencesFormattedForEvent,
					{
						start: new Date(2024, 9, 9, 10, 0),
						end: new Date(2024, 9, 10, 10, 0),
						title: "🎓 1/5",
						className: "bg-purple-500 border-none my-0.5",
						id: "21",
					},
					{
						start: new Date(2024, 9, 9, 10, 0),
						end: new Date(2024, 9, 10, 10, 0),
						title: "⛑ 1/1",
						className: "bg-sky-400 border-none my-0.5",
						id: "22",
					},
					{
						start: new Date(2024, 9, 9, 10, 0),
						end: new Date(2024, 9, 10, 10, 0),
						title: "🎅 0/1",
						className: "bg-sky-600 border-none my-0.5",
						id: "23",
					},
					{
						start: new Date(2024, 9, 10, 10, 0),
						end: new Date(2024, 9, 13, 10, 0),
						title: "🎓 1/5",
						className: "bg-purple-500 border-none my-0.5",
						id: "1",
					},
					{
						start: new Date(2024, 9, 10, 10, 0),
						end: new Date(2024, 9, 13, 10, 0),
						title: "⛑ 1/1",
						className: "bg-sky-400 border-none my-0.5",
						id: "8392932",
					},
					{
						start: new Date(2024, 9, 10, 10, 0),
						end: new Date(2024, 9, 13, 10, 0),
						title: "🎅 0/1",
						className: "bg-sky-600 border-none my-0.5",
						id: "8392939",
					},
				]}
				
				height="70vh"
				eventClick={eventClick}/>
			<p>
				selected event: {selectedPreferenceId} {selectedPreference?.description}
			</p>
			{
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
			}
			
			<ToastContainer
				limit={2}
				rtl={true} />
		</>
	);
};

const renderEventContent = (eventInfo: EventContentArg) => {
	console.log("@eventInfo", eventInfo);
	
	return (
		<>
			{eventInfo.event.title}
		</>
	);
};
