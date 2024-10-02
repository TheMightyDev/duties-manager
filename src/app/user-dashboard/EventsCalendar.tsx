import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import React from "react";
import heLocale from "@fullcalendar/core/locales/he";

export const EventsCalendar: React.FC = () => {
	return (
		<FullCalendar
			locale={heLocale}
			plugins={[ dayGridPlugin ]}
			initialView="dayGridMonth"
			events={[
				{
					title: "מסיבת יום הולדת לאימא שלי",
					start: "2024-10-05",
					end: "2024-10-08",
				},
			]}
			height="60vh"/>
	);
};
