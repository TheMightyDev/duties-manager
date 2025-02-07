"use client";

import { FloatingDialog } from "@/app/_components/floating-dialog/floating-dialog";
import { PreferenceForm } from "@/app/user-dashboard/actions/submit-preferences/components/preference-form";
import { PreferenceInfo } from "@/app/user-dashboard/actions/submit-preferences/components/preference-info";
import { EventKind } from "@/app/user-dashboard/actions/submit-preferences/types";
import {
	type PersonalCalendarProps,
	usePersonalCalendar,
} from "@/app/user-dashboard/actions/submit-preferences/use-personal-calendar";
import heLocale from "@fullcalendar/core/locales/he";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { type Preference } from "@prisma/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function PersonalCalendar(props: PersonalCalendarProps) {
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

		selectedEvent,
		unselectEventAndCloseDialog,

		floatingDialogRef,
	} = usePersonalCalendar(props);

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
				timeZone="UTC"
				showNonCurrentDates={true}
				nextDayThreshold="11:00:00"
				locale={heLocale}
				plugins={[dayGridPlugin, interactionPlugin]}
				initialView="dayGridMonth"
				editable={true}
				eventDurationEditable={false}
				selectable={true}
				{...fcEventHandlers}
				dayCellClassNames={(arg) => {
					if (arg.date < new Date()) {
						return "bg-slate-200";
					}

					return "";
				}}
				height="85vh"
			/>
			<FloatingDialog
				{...floatingDialogData}
				className="shadow-xl shadow-black/20"
				containerRef={floatingDialogRef}
			>
				{selectedEvent && selectedEvent.kind === EventKind.PREFERENCE && (
					<>
						<PreferenceInfo
							preference={selectedEvent.eventData as Preference}
							handleClose={unselectEventAndCloseDialog}
							handleDeletePreference={() => {
								preferenceOperationsWrappers.deletePreference({
									id: selectedEvent.eventData.id,
								});
							}}
						/>
						<pre dir="ltr">
							{JSON.stringify(selectedEvent.eventData, null, 2)}
						</pre>
					</>
				)}
				{proposedEventDatesSelection && (
					<PreferenceForm
						userId="ofeks"
						datesSelection={proposedEventDatesSelection}
						getPreference={getPreference}
						closeDialog={closeAddPreference}
						setDatesSelection={setProposedEventDatesSelection}
						isOpen={floatingDialogData.isShown}
						createPreference={preferenceOperationsWrappers.createPreference}
					/>
				)}
				{/* {
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
				{
					selectedPreference &&
					<ViewPreference
						preference={selectedPreference}
						closeDialog={() => {
							setIsFloatingDialogShown(false);
						}}
					/>
				} */}
			</FloatingDialog>

			<ToastContainer
				limit={2}
				rtl={true}
				position="bottom-left"
				toastClassName="bottom-10 md:bottom-0"
			/>
			{/* <AcceptCloseDialog
				isOpen={false}
				actionButtonText="מחיקה"
				cancelButtonText="ביטול"
			>
				למחוק את ההסתייגות?
			</AcceptCloseDialog> */}
		</>
	);
}
