import { type DutyWithAssignments } from "@/server/api/types/DutyWithAssignments";
import { type EventInput } from "@fullcalendar/core/index.js";
import React from "react";
import { useImmer } from "use-immer";

export interface DutiesCalendarProps {
	initialDutiesWithAssignments: DutyWithAssignments[];
	
}
interface Params extends DutiesCalendarProps {
}

interface Return {
	fcEvents: EventInput[];
}

export const useDutiesCalendar = ({ initialDutiesWithAssignments }: Params): Return => {
	// `useImmer` is used because it makes it easier to work with arrays, by not having to create a new one in every update
	const [ duties, updateDuties ] = useImmer(initialDutiesWithAssignments);
	
	const fcEvents = React.useMemo(() => {
		return duties.map<EventInput>((duty) => ({
			id: duty.id,
			title: duty.description ?? "שמירה בבסיס",
			start: duty.startDate,
			end: duty.endDate,
		}));
	}, [ duties ]);
	
	return {
		fcEvents,
	};
};
