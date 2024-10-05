"use client";
"use client";

import { type DutiesCalendarProps, useDutiesCalendar } from "@/app/admin/duties/useDutiesCalendar";
import heLocale from "@fullcalendar/core/locales/he";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import React from "react";
import "react-toastify/dist/ReactToastify.css";

export const DutiesCalendar: React.FC<DutiesCalendarProps> = ({
	initialDutiesWithAssignments,
	fetchDutiesOnMonth,
}) => {
	const {
		calendarRef,
		fcEvents,
		fcEventHandlers,
	} = useDutiesCalendar({
		initialDutiesWithAssignments,
		fetchDutiesOnMonth,
	});
	
	return (
		<>
			<FullCalendar
				ref={calendarRef}
				events={fcEvents}
				
				height="70vh"
				displayEventTime={false}
				showNonCurrentDates={false}
				nextDayThreshold="11:00:00"
				locale={heLocale}
				plugins={[ dayGridPlugin, interactionPlugin ]}
				initialView="dayGridMonth"
				
				selectable={true}
				eventOverlap={true}
				
				select={fcEventHandlers.select}
				datesSet={fcEventHandlers.datesSet}
			/>
		</>
	);
};
