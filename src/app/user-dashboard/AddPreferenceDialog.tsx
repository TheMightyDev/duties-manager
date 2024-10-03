"use client";

import { type DatesSelection } from "@/app/user-dashboard/types";
import { PreferenceImportance, PreferenceReason, type Preference } from "@prisma/client";
import { addDays, format, parse } from "date-fns";
import React from "react";

interface AddPreferenceDialogProps {
	isOpen: boolean;
	datesSelection: DatesSelection;
	setDatesSelection: React.Dispatch<React.SetStateAction<DatesSelection | null>>;
	getPreferenceInDateRange: (datesSelection: DatesSelection) => Preference | undefined;
	addNewPreferenceWrapper: (newPreference: Preference) => void;
	closeDialog: () => void;
}

export const AddPreferenceDialog: React.FC<AddPreferenceDialogProps> = ({
	isOpen,
	datesSelection,
	setDatesSelection,
	getPreferenceInDateRange,
	addNewPreferenceWrapper,
	closeDialog,
}) => {
	const inputRefs = {
		reason: React.useRef<HTMLSelectElement>(null),
		importance: React.useRef<HTMLSelectElement>(null),
		description: React.useRef<HTMLInputElement>(null),
	};
	
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
	
	const handleCancel = () => {
		closeDialog();
	};
	
	const handleSubmit = () => {
		const reason = inputRefs.reason.current?.value as PreferenceReason;
		const importance = inputRefs.importance.current?.value as PreferenceImportance;
		const description = inputRefs.description.current?.value as string;
		
		addNewPreferenceWrapper({
			id: Math.round(Math.random() * 500_000).toString(),
			userId: "user1",
			reason,
			importance,
			description,
			startDate: datesSelection.start,
			endDate: datesSelection.end,
		});
		
		closeDialog();
	};
	
	React.useEffect(() => {
		inputRefs.reason.current!.value = PreferenceReason.VACATION;
		inputRefs.importance.current!.value = PreferenceImportance.NORMAL_PRIORITY;
		inputRefs.description.current!.value = "";
	}, [ isOpen ]);

	return (
		<div className="bg-black bg-opacity-55 absolute top-0 z-10 [width:100vw] [height:100vh]">
			<div className="bg-white absolute top-0 left-0 right-0 m-auto bottom-0 [width:100vw] [height:100vh] md:w-96 md:h-96 md:rounded-xl">
				<div>
					<label htmlFor="preference-start-date">
						החל מ
					</label>
					<input
						type="date"
						id="preference-start-date"
						className="text-black"
						value={format(datesSelection.start, "yyyy-MM-dd")}
						onChange={startDateChangeHandler}
						required/>
				</div>
				<div>
					<label htmlFor="preference-end-date">
						עד
					</label>
					<input
						type="date"
						id="preference-end-date"
						className="text-black"
						value={format(datesSelection.end, "yyyy-MM-dd")}
						onChange={endDateChangeHandler}
						required/>
				</div>
				{
					(datesSelection.start > datesSelection.end) &&
					<p>
						Reorder dates.
					</p>
				}
				<p>
					{preference ? "there's !!" : "we good"}
				</p>
				<div>
					<label htmlFor="preference-reason-select">סיבת ההסתייגות</label>
					<select
						name="preference-reason"
						id="preference-reason-select"
						ref={inputRefs.reason}>
						{
							Object.keys(PreferenceReason).map((reason) => (
								<option value={reason}>{reason}</option>
							))
						}
					</select>
				</div>
				<div>
					<label htmlFor="preference-importance-select">
						חומרת ההסתייגות
					</label>
					<select
						name="preference-importance"
						id="preference-importance-select"
						ref={inputRefs.importance}>
						{
							Object.keys(PreferenceImportance).map((importance) => (
								<option value={importance}>{importance}</option>
							))
						}
					</select>
				</div>
				<div>
					<label htmlFor="preference-description">
						פירוט
					</label>
					<textarea
						id="preference-description"
						maxLength={40}
						ref={inputRefs.description}
						className="resize-none"></textarea>
				</div>
				<div>
					<button onClick={handleCancel}>
						ביטול
					</button>
					<button
						disabled={preference}
						onClick={handleSubmit}>
						הגשת הסתייגות
					</button>
				</div>
			</div>
		</div>
	);
};
