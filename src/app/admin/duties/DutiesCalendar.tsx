"use client";
"use client";

import { type DutiesCalendarProps, useDutiesCalendar } from "@/app/admin/duties/useDutiesCalendar";
import heLocale from "@fullcalendar/core/locales/he";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import React from "react";
import "react-toastify/dist/ReactToastify.css";

export const DutiesCalendar: React.FC<DutiesCalendarProps> = ({ initialDutiesWithAssignments }) => {
	const { fcEvents } = useDutiesCalendar({
		initialDutiesWithAssignments,
	});
	
	return (
		<>
			<FullCalendar
				events={fcEvents}
				
				displayEventTime={false}
				showNonCurrentDates={false}
				nextDayThreshold="11:00:00"
				locale={heLocale}
				plugins={[ dayGridPlugin, interactionPlugin ]}
				initialView="dayGridMonth"
				
				selectable={true}
				eventOverlap={true}
			/>
		</>
	);
};
