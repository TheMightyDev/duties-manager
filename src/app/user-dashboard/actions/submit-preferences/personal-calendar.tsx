"use client";

import { FloatingDialog } from "@/app/_components/floating-dialog/floating-dialog";
import { PreferenceDialogContent } from "@/app/user-dashboard/actions/submit-preferences/components/preference-dialog-content";
import { PreferenceForm } from "@/app/user-dashboard/actions/submit-preferences/components/preference-form";
import { EventKind } from "@/app/user-dashboard/actions/submit-preferences/types";
import {
	type PersonalCalendarProps,
	usePersonalCalendar,
} from "@/app/user-dashboard/actions/submit-preferences/use-personal-calendar";
import heLocale from "@fullcalendar/core/locales/he";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function PersonalCalendar(props: PersonalCalendarProps) {
	const {
		fcEvents,
		fcEventHandlers,

		getPreference,
		preferenceOperationsWrappers,

		floatingDialogData,

		selectedEvent,
		unselectEventAndCloseDialog,

		floatingDialogRef,
	} = usePersonalCalendar(props);

	preferenceOperationsWrappers.updatePreference;

	return (
		<>
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
				{selectedEvent?.kind === EventKind.PREFERENCE && (
					<PreferenceDialogContent
						preference={selectedEvent.eventData}
						closeDialog={unselectEventAndCloseDialog}
						getPreference={getPreference}
						{...preferenceOperationsWrappers}
					/>
					// <PreferenceInfo
					// 	preference={selectedEvent.eventData as Preference}
					// 	handleClose={unselectEventAndCloseDialog}
					// 	handleDeletePreference={() => {
					// 		preferenceOperationsWrappers.deletePreference({
					// 			id: selectedEvent.eventData.id,
					// 		});
					// 	}}
					// />
				)}
				{selectedEvent?.kind === EventKind.NEW_PREFERENCE && (
					<PreferenceForm
						userId="ofeks"
						initialPreferenceData={selectedEvent.eventData}
						getPreference={getPreference}
						closeDialog={unselectEventAndCloseDialog}
						createPreference={preferenceOperationsWrappers.createPreference}
					/>
				)}
			</FloatingDialog>

			<ToastContainer
				limit={2}
				rtl={true}
				position="bottom-left"
				pauseOnFocusLoss={false}
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
