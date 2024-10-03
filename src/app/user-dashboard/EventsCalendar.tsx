"use client";

import { AddPreferenceDialog, AddPreferenceDialogMode } from "@/app/user-dashboard/AddPreferenceDialog";
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
	deletePreferenceById: (id: string) => Promise<boolean>;
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
	deletePreferenceById: deletePreferenceById,
}) => {
	const [ dialogMode, setDialogMode ] = React.useState<AddPreferenceDialogMode>(AddPreferenceDialogMode.ADD);
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
				
				className: preference.reason === PreferenceReason.CELEBRATION ? "bg-pink-700 border-pink-900" : "",
				// color: preference.reason === PreferenceReason.CELEBRATION ? "pink" : "",
			}));
		},
		[ preferences ]
	);
	
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
	
	const createPreferenceWrapper = (newPreference: Preference) => {
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
	
	const deletePreferenceWrapper = (id: string) => {
		deletePreferenceById(id).then(
			() => {
				toast.success("ההסתייגות נמחקה בהצלחה");
				updatePreferences((draft) => {
					const deletedPreferenceIndex = draft.findIndex((preference) => preference.id === id);
					
					// Note: `splice` mutates the original array
					draft.splice(deletedPreferenceIndex, 1);
				});
			},
			() => {
				toast.error("מחיקת ההסתייגות נכשלה");
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
					mode={dialogMode}
					isOpen={isDialogOpen}
					datesSelection={datesSelection}
					setDatesSelection={setDatesSelection}
					selectedPreference={selectedPreference}
					getPreferenceInDateRange={getPreferenceInDateRange}
					createPreference={createPreferenceWrapper}
					deletePreference={deletePreferenceWrapper}
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
