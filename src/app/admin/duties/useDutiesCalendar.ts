import { type DatesSelection } from "@/app/user-dashboard/types";
import { type DutyWithAssignments } from "@/server/api/types/DutyWithAssignments";
import { type DateSelectArg, type DatesSetArg, type EventInput } from "@fullcalendar/core/index.js";
import type FullCalendar from "@fullcalendar/react";
import { add, addMinutes, subDays, subMinutes } from "date-fns";
import React, { useMemo, useRef } from "react";
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
	select: (arg: DateSelectArg) => void;
	datesSet: (arg: DatesSetArg) => void;
}

interface Return {
	calendarRef: React.RefObject<FullCalendar>;
	fcEvents: EventInput[];
	fcEventHandlers: RelevantFcEventHandlers;
}

export const useDutiesCalendar = ({
	initialDutiesWithAssignments,
	fetchDutiesOnMonth,
}: Params): Return => {
	const calendarRef = useRef<FullCalendar>(null);
	// `useImmer` is used because it makes it easier to work with arrays, by not having to create a new one in every update
	const [ duties, updateDuties ] = useImmer(initialDutiesWithAssignments);
	
	const [ proposedEventDatesSelection, setProposedEventDatesSelection ] = React.useState<DatesSelection | null>(null);
	
	const fcDutiesEvents = useMemo(() => {
		return duties.map<EventInput>((duty) => ({
			id: duty.id,
			title: duty.description ?? "שמירה בבסיס",
			start: duty.startDate,
			end: duty.endDate,
		}));
	}, [ duties ]);
	
	const fcEvents: EventInput[] = useMemo(() => {
		if (proposedEventDatesSelection) {
			return [
				...fcDutiesEvents,
				{
					id: "placeholder",
					allDay: true,
					color: "pink",
					title: "placeholder",
					start: proposedEventDatesSelection.start,
					end: addMinutes(proposedEventDatesSelection.end, 1),
				},
			];
		}

		return fcDutiesEvents;
	}, [ fcDutiesEvents, proposedEventDatesSelection ]);
	
	const fcEventHandlers: RelevantFcEventHandlers = {
		select: (arg: DateSelectArg) => {
			const dayOfTheWeek = arg.start.getDay();
			// If it's between Thursday and Saturday (inclusive),
			// the admin most likely wants to add a weekend guarding duty

			const isLikelyWeekendGuarding = 4 <= dayOfTheWeek && dayOfTheWeek <= 6;
			const nextDatesSelection: DatesSelection = isLikelyWeekendGuarding ?
				{
				// We move the start day to Thursday
					start: subDays(arg.start, dayOfTheWeek - 4),
					// We fixate the end day to Saturday midnight
					end: add(subDays(arg.start, dayOfTheWeek - 4), {
						days: 3,
						minutes: -1,
					}),
				}
				: {
					start: arg.start,
					// When we select a dates range in full calendar, the end date is midnight of the next selected date
					end: subMinutes(arg.end, 1),
				};
			
			setProposedEventDatesSelection(nextDatesSelection);
		},
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
		calendarRef,
		fcEvents,
		fcEventHandlers,
	};
};
