"use client";

import { AcceptCloseDialog } from "@/app/user-dashboard/calendar/AcceptCloseDialog";
import { AddPreference, EditPreference } from "@/app/user-dashboard/calendar/floating-dialog-contents";
import { FloatingDialog } from "@/app/user-dashboard/calendar/FloatingDialog";
import { type PreferencesCalendarProps, usePreferencesCalendar } from "@/app/user-dashboard/calendar/usePreferencesCalendar";
import heLocale from "@fullcalendar/core/locales/he";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const PreferencesCalendar: React.FC<PreferencesCalendarProps> = ({
	initialPreferences,
	fetchPreferences,
	createPreference,
	deletePreference,
	updatePreference,
}) => {
	const {
		fcEvents,
		fcEventHandlers,
		
		getPreference,
		preferenceOperationsWrappers,
		
		floatingDialogData,
		setIsFloatingDialogShown,
		isAddPreferenceDialogOpen,
		proposedEventDatesSelection,
		setProposedEventDatesSelection,
		closeAddPreference,
		selectedPreference,
		
		selectedUserId,
		handleUserIdChange,
	} = usePreferencesCalendar({
		createPreference,
		fetchPreferences,
		updatePreference,
		deletePreference,
		initialPreferences,
	});
	
	return (
		<>
			<p>
				<label htmlFor="selected-user-id">User ID </label>
				<input
					value={Number(selectedUserId.replace("user", ""))}
					type="number"
					id="selected-user-id"
					onChange={handleUserIdChange}
				/>
			</p>
			<FullCalendar
				events={fcEvents}
				
				showNonCurrentDates={false}
				nextDayThreshold="11:00:00"
				locale={heLocale}
				plugins={[ dayGridPlugin, interactionPlugin ]}
				initialView="dayGridMonth"
				
				editable={true}
				eventDurationEditable={false}
				selectable={true}
				eventOverlap={false}

				select={fcEventHandlers.select}
				eventClick={fcEventHandlers.eventClick}
				eventDrop={fcEventHandlers.eventDrop}
				dateClick={fcEventHandlers.dateClick}
				eventDidMount={fcEventHandlers.eventDidMount}
				datesSet={fcEventHandlers.datesSet}
				height="70vh"
			/>
			<FloatingDialog
				{...floatingDialogData}
				setIsShown={setIsFloatingDialogShown}
			>
				{
					(proposedEventDatesSelection && !selectedPreference) &&
					<AddPreference
						isOpen={isAddPreferenceDialogOpen}
						userId={selectedUserId}
						datesSelection={proposedEventDatesSelection}
						setDatesSelection={setProposedEventDatesSelection}
						getPreference={getPreference}
						createPreference={preferenceOperationsWrappers.createPreference}
						updatePreference={preferenceOperationsWrappers.updatePreference}
						deletePreference={preferenceOperationsWrappers.deletePreference}
						closeDialog={closeAddPreference}
					/>
				}
				{
					selectedPreference &&
					<EditPreference
						getPreference={getPreference}
						isOpen={floatingDialogData.isShown}
						preference={selectedPreference}
						createPreference={preferenceOperationsWrappers.createPreference}
						updatePreference={preferenceOperationsWrappers.updatePreference}
						deletePreference={preferenceOperationsWrappers.deletePreference}
						closeDialog={() => {
							setIsFloatingDialogShown(false);
						}}
					/>
				}
				
			</FloatingDialog>
			
			<ToastContainer
				limit={2}
				rtl={true}
				position ="bottom-left"
				toastClassName="bottom-10 md:bottom-0"
			/>
			<AcceptCloseDialog
				isOpen={false}
				actionButtonText="מחיקה"
				cancelButtonText="ביטול"
			>
				למחוק את ההסתייגות?
			</AcceptCloseDialog>
		</>
	);
};
