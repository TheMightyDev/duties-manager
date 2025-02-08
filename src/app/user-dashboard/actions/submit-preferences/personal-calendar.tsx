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
import { createId } from "@paralleldrive/cuid2";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function PersonalCalendar(props: PersonalCalendarProps) {
	const {
		fcEvents,
		fcEventHandlers,

		getPreference,
		preferenceOperationsWrappers,

		floatingDialogData,
		recalculateFloatingDialogPosition,

		selectedEvent,
		updateSelectedPreferenceDatesSelection,
		unselectEventAndCloseDialog,

		floatingDialogRef,
	} = usePersonalCalendar(props);

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
			<FloatingDialog {...floatingDialogData} containerRef={floatingDialogRef}>
				{selectedEvent?.kind === EventKind.PREFERENCE && (
					<PreferenceDialogContent
						preference={selectedEvent.eventData}
						closeDialog={unselectEventAndCloseDialog}
						getPreference={getPreference}
						recalculateFloatingDialogPosition={
							recalculateFloatingDialogPosition
						}
						{...preferenceOperationsWrappers}
					/>
				)}
				{selectedEvent?.kind === EventKind.NEW_PREFERENCE && (
					<PreferenceForm
						initialPreferenceData={selectedEvent.eventData}
						getPreference={getPreference}
						updateSelectedPreferenceDatesSelection={
							updateSelectedPreferenceDatesSelection
						}
						closeDialog={unselectEventAndCloseDialog}
						handleCancel={unselectEventAndCloseDialog}
						handleSubmit={(submittedData) => {
							preferenceOperationsWrappers.createPreference({
								id: createId(),
								userId: props.userId,
								...submittedData,
							});
						}}
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
