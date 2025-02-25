"use client";

import { FloatingDialog } from "@/app/_components/floating-dialog/floating-dialog";
import { AcceptCloseDialog } from "@/app/user-dashboard/calendar/accept-close-dialog";
import { AddPreference } from "@/app/user-dashboard/calendar/floating-dialog-contents/add-preference";
import { EditPreference } from "@/app/user-dashboard/calendar/floating-dialog-contents/edit-preference";
import { ViewPreference } from "@/app/user-dashboard/calendar/floating-dialog-contents/view-preference";
import { type PreferencesCalendarProps, usePreferencesCalendar } from "@/app/user-dashboard/calendar/use-preferences-calendar";
import heLocale from "@fullcalendar/core/locales/he";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { PreferenceReason } from "@prisma/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function PreferencesCalendar({
	initialPreferences,
	fetchPreferences,
	createPreference,
	deletePreference,
	updatePreference,
}: PreferencesCalendarProps) {
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
			<h2 className="text-3xl font-bold">hey</h2>
			<FullCalendar
				events={fcEvents}
				timeZone="UTC"
				
				showNonCurrentDates={false}
				nextDayThreshold="11:00:00"
				locale={heLocale}
				plugins={[ dayGridPlugin, interactionPlugin ]}
				initialView="dayGridMonth"
				
				editable={true}
				eventDurationEditable={false}
				selectable={true}
				
				{...fcEventHandlers}
				
				height="70vh"
			/>
			<FloatingDialog {...floatingDialogData}>
				{
					(!selectedPreference) &&
					<AddPreference
						isOpen={isAddPreferenceDialogOpen}
						userId={selectedUserId}
						datesSelection={proposedEventDatesSelection ?? {
							start: new Date(),
							end: new Date(),
						}}
						setDatesSelection={setProposedEventDatesSelection}
						getPreference={getPreference}
						createPreference={preferenceOperationsWrappers.createPreference}
						updatePreference={preferenceOperationsWrappers.updatePreference}
						deletePreference={preferenceOperationsWrappers.deletePreference}
						closeDialog={closeAddPreference}
					/>
				}
				{
					(selectedPreference &&
						selectedPreference.reason !== PreferenceReason.EXEMPTION &&
						selectedPreference.reason !== PreferenceReason.ABSENCE
					) &&
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
				{
					(selectedPreference && (
						selectedPreference.reason === PreferenceReason.EXEMPTION ||
						selectedPreference.reason === PreferenceReason.ABSENCE
					)) &&
					<ViewPreference
						preference={selectedPreference}
						closeDialog={() => {
							setIsFloatingDialogShown(false);
						}}
					/>
				}
			</FloatingDialog>
			
			<ToastContainer
				limit={2}
				rtl={true}
				position="bottom-left"
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
