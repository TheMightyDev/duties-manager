"use client";

import { FloatingDialog } from "@/app/_components/floating-dialog/floating-dialog";
import { PreferenceForm } from "@/app/user-dashboard/actions/submit-preferences/components/preference-form";
import { usePersonalCalendar } from "@/app/user-dashboard/actions/submit-preferences/use-personal-calendar";
import { type PreferencesCalendarProps } from "@/app/user-dashboard/calendar/use-preferences-calendar";
import heLocale from "@fullcalendar/core/locales/he";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function PersonalCalendar({
	initialPreferences,
	fetchPreferences,
	createPreference,
	deletePreference,
	updatePreference,
}: PreferencesCalendarProps) {
	// const duration: z.infer<typeof SubmitPreferenceSchema> = {
	// 	startDate: new Date("2024-10-05"),
	// 	endDate: new Date("2024-10-03"),
	// 	kind: PreferenceKind.APPOINTMENT,
	// 	importance: PreferenceImportance.CANT,
	// 	description: "woeee",
	// };
	
	// const validation = SubmitPreferenceSchema.safeParse(duration);
	
	// console.log("@validation", validation);
	
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
		
		floatingDialogRef,
	} = usePersonalCalendar({
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
				
				showNonCurrentDates={true}
				nextDayThreshold="11:00:00"
				locale={heLocale}
				plugins={[ dayGridPlugin, interactionPlugin ]}
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
				{
					proposedEventDatesSelection &&
					<PreferenceForm
						startDate={proposedEventDatesSelection.start}
						endDate={proposedEventDatesSelection.end}
					/>
				}
				{/* p<br/>pp<br/>pp<br/>pp
				p<br/>pp<br/>pp<br/>pp
				p<br/>pp<br/>pp<br/>pp */}
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
};
