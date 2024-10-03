"use client";

import { AddPreferenceDialog } from "@/app/user-dashboard/AddPreferenceDialog";
import { type DatesSelection } from "@/app/user-dashboard/types";
import { type DateSelectArg, type EventClickArg, type EventInput } from "@fullcalendar/core/index.js";
import heLocale from "@fullcalendar/core/locales/he";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { type DateClickArg } from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { type Preference, PreferenceImportance, PreferenceReason } from "@prisma/client";
import { addMinutes, subMinutes } from "date-fns";
import { seedUsers } from "prisma/seedData/seedUsers";
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useImmer } from "use-immer";

interface EventsCalendarProps {
	initialPreferences: Preference[];
	addNewPreference: (newPreference: Preference) => Promise<boolean>;
}

const mockPreferences = [ {
	id: "123",
	userId: seedUsers[0].id,
	startDate: new Date(2024, 9, 25),
	endDate: new Date(2024, 9, 27, 10, 0, 20),
	reason: PreferenceReason.APPOINTMENT,
	description: "heh",
	importance: PreferenceImportance.HIGH_PRIORITY,
} ];

export const EventsCalendar: React.FC<EventsCalendarProps> = ({
	initialPreferences,
	addNewPreference,
}) => {
	const [ selectedPreferenceId, setSelectedPreferenceId ] = React.useState<string | null>(null);
	const [ isDialogOpen, setIsDialogOpen ] = React.useState<boolean>(false);
	const [ datesSelection, setDatesSelection ] = React.useState<DatesSelection | null>(null);
	const [ preferences, updatePreferences ] = useImmer<Preference[]>(initialPreferences);

	const preferencesFormattedForEvent = React.useMemo(
		() => {
			console.log("@preferences", preferences);
			
			return preferences.map<EventInput>((preference) => ({
				id: preference.id,
				allDay: true,
				title: preference.description,
				start: preference.startDate,
				end: addMinutes(preference.endDate, 1),
				
				color: preference.reason === PreferenceReason.CELEBRATION ? "pink" : "",
			}));
		},
		[ preferences ]
	);
	const selectedPreference = preferences.find((preference) => preference.id === selectedPreferenceId);
	
	const getPreferenceInDateRange = ({ start, end }: DatesSelection): Preference | undefined => (
		preferences.find((preference) => {
			return ((preference.startDate >= start && preference.startDate < end) ||
				(preference.endDate >= start && preference.endDate < end) ||
				(start >= preference.startDate && end <= preference.endDate));
		})
	);
	const dateClickHandler = (arg: DateClickArg) => {
		// console.log("@clicked", arg);
		// setSelectedPreferenceId(undefined);
	};
	
	const addNewPreferenceWrapper = (newPreference: Preference) => {
		addNewPreference(newPreference).then(
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
	
	const dateSelectHandler = (arg: DateSelectArg) => {
		console.log("@selected", arg);
		
		const datesSelection: DatesSelection = {
			start: arg.start,
			// When we select a dates range in full calendar, the end date is midnight of the next selected date
			end: subMinutes(arg.end, 1),
		};
		
		const preferenceInDateRange = getPreferenceInDateRange(datesSelection);
		
		console.log("@preferenceInDateRange", preferenceInDateRange);
		if (preferenceInDateRange) {
			setSelectedPreferenceId(preferenceInDateRange.id);
			setIsDialogOpen(false);
			setDatesSelection(null);
			toast.error("כבר קיים אירוע בטווח התאריכים שנבחר", {
				rtl: true,
			});
		} else {
			setSelectedPreferenceId(null);
			setIsDialogOpen(true);
			setDatesSelection(datesSelection);
		}
	};
	
	const eventClick = (arg: EventClickArg) => {
		const m = arg.event.id;
		setSelectedPreferenceId(m);
		console.log("@eventClick", arg.event);
	};

	return (
		<>
			<FullCalendar
				showNonCurrentDates={false}
				locale={heLocale}
				plugins={[ dayGridPlugin, interactionPlugin ]}
				initialView="dayGridMonth"
				dateClick={dateClickHandler}
				selectable={true}
				select={dateSelectHandler}
				events={preferencesFormattedForEvent}
			
				height="70vh"
				eventClick={eventClick}/>
			<p>
				selected event: {selectedPreferenceId} {selectedPreference?.description}
			</p>
			{
				datesSelection &&
				<AddPreferenceDialog
					isOpen={isDialogOpen}
					datesSelection={datesSelection}
					setDatesSelection={setDatesSelection}
					getPreferenceInDateRange={getPreferenceInDateRange}
					addNewPreferenceWrapper={addNewPreferenceWrapper}
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
