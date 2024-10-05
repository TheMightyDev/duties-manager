import { type DutyWithAssignments } from "@/server/api/types/DutyWithAssignments";
import { type DatesSetArg, type EventInput } from "@fullcalendar/core/index.js";
import React from "react";
import { useImmer } from "use-immer";

export interface DutiesCalendarProps {
	initialDutiesWithAssignments: DutyWithAssignments[];
	fetchDutiesOnMonth: (params: {
		year: number;
		monthIndex: number;
	}) => Promise<DutyWithAssignments[]>;
}
interface Params extends DutiesCalendarProps {
}

interface RelevantFcEventHandlers {
	datesSet: (arg: DatesSetArg) => void;
}

interface Return {
	fcEvents: EventInput[];
	fcEventHandlers: RelevantFcEventHandlers;
}

export const useDutiesCalendar = ({
	initialDutiesWithAssignments,
	fetchDutiesOnMonth,
}: Params): Return => {
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
	
	const fcEventHandlers: RelevantFcEventHandlers = {
		datesSet: (arg: DatesSetArg) => {
			const year = arg.start.getUTCFullYear();
			const monthIndex = arg.start.getUTCMonth();
			
			fetchDutiesOnMonth({
				year,
				monthIndex,
			}).then(
				(nextDuties) => {
					updateDuties((draft) => {
						draft.slice();
						draft.push(...nextDuties);
					});
				}
			);
		},
	};

	return {
		fcEvents,
		fcEventHandlers,
	};
};
