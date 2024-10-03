import { type DatesSelection } from "@/app/user-dashboard/types";
import { type Preference } from "@prisma/client";
import { addDays, format, parse } from "date-fns";
import React from "react";

interface AddPreferenceDialogProps {
	isOpen: boolean;
	datesSelection: DatesSelection;
	setDatesSelection: React.Dispatch<React.SetStateAction<DatesSelection | null>>;
	getPreferenceInDateRange: (datesSelection: DatesSelection) => Preference | undefined;
}

export const AddPreferenceDialog: React.FC<AddPreferenceDialogProps> = ({
	isOpen,
	datesSelection,
	setDatesSelection,
	getPreferenceInDateRange,
}) => {
	console.log("datesSelection", format(datesSelection.start, "yyyy-MM-dd"));
	
	const preference = getPreferenceInDateRange({
		start: datesSelection.start,
		end: addDays(datesSelection.end, 1),
	}) !== undefined;
	console.log("@preference", preference);
	
	const generalSetDateChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, which: "start" | "end") => {
		const nextValue = event.target.value;
		console.log("nextValue", nextValue);
		
		setDatesSelection((prev) => {
			if (prev) {
				const nextDatesSelection = {
					...prev,
					[which]: parse(nextValue, "yyyy-MM-dd", new Date()),
				};
				
				return nextDatesSelection;
			} else {
				return null;
			}
		});
	};
	
	const startDateChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
		generalSetDateChangeHandler(event, "start");
	};
	
	const endDateChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
		generalSetDateChangeHandler(event, "end");
	};
	
	return (
		<>
			<input
				type="date"
				value={format(datesSelection.start, "yyyy-MM-dd")}
				onChange={startDateChangeHandler}/>
			<input
				type="date"
				value={format(datesSelection.end, "yyyy-MM-dd")}
				onChange={endDateChangeHandler}/>
			{
				(datesSelection.start > datesSelection.end) &&
				<p>
					Reorder dates.
				</p>
			}
			<p>
				{preference ? "there's !!" : "we good"}
			</p>
		</>
	);
};
