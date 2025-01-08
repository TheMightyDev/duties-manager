"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/app/_components/ui/popover";
import heLocale from "@fullcalendar/core/locales/he";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { addDays } from "date-fns";
import "react-toastify/dist/ReactToastify.css";

export default function SubmitPreferencesPage() {
	return (
		<div dir="ltr">
			{"p"}
			<FullCalendar
				events={[
					{
						allDay: true,
						start: new Date(),
						end: addDays(new Date(), 5),
						title: "he",
						
					},
				]}
				timeZone="UTC"
				
				showNonCurrentDates={false}
				nextDayThreshold="11:00:00"
				locale={heLocale}
				plugins={[ dayGridPlugin, interactionPlugin ]}
				initialView="dayGridMonth"
				
				editable={true}
				eventDurationEditable={false}
				selectable={true}
				
				eventContent={(params) => (
					<Popover>
						<PopoverTrigger className="w-full text-start">
							{params.event.title}
						</PopoverTrigger>
						<PopoverContent className="bg-white/20 ">
							hefddff
						</PopoverContent>
					</Popover>
						
				)}
				// {...fcEventHandlers}
				
				height="85vh"
			/>
		</div>
	);
}
