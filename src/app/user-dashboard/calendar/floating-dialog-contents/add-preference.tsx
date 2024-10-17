"use client";

import { FloatingDialogClassicHeader } from "@/app/_components/floating-dialog/helpers/classic-header";
import { MIN_PREFERENCE_DETAILS_LENGTH } from "@/app/_utils/constants";
import { type DatesSelection, type GetPreferenceParams, type PreferenceOperations } from "@/app/user-dashboard/types";
import { PreferenceImportance, PreferenceReason, type Preference } from "@prisma/client";
import { add, format, parse } from "date-fns";
import React, { useMemo, useRef, useState } from "react";

interface AddPreferenceProps extends PreferenceOperations<void> {
	isOpen: boolean;
	userId: string;
	datesSelection: DatesSelection;
	setDatesSelection: React.Dispatch<React.SetStateAction<DatesSelection | null>>;
	/** Required if on "edit" mode */
	selectedPreference?: Preference;
	getPreference: (params: GetPreferenceParams) => Preference | undefined;
	closeDialog: () => void;
}

export const AddPreference: React.FC<AddPreferenceProps> = ({
	isOpen,
	userId,
	datesSelection,
	setDatesSelection,
	
	getPreference,
	createPreference,
	closeDialog,
}) => {
	// Description gets a state because you can't submit a preference without a description.
	// For performance reasons we update the reason only on blur (when the input loses focus)
	const [ description, setDescription ] = useState<string>("");
	
	const inputRefs = {
		reason: useRef<HTMLSelectElement>(null),
		importance: useRef<HTMLSelectElement>(null),
		// It also gets a ref to clear the output when the dialog is opened
		description: useRef<HTMLTextAreaElement>(null),
	};
	
	const isTherePreferenceFallInDateRange = useMemo(() => (
		getPreference({
			datesSelection,
		}) !== undefined
	), [ datesSelection ]);
	
	const generalSetDateChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, which: "start" | "end") => {
		const nextValue = event.target.value;
		console.log("nextValue", nextValue);
		
		setDatesSelection((prev) => {
			if (prev) {
				const parsedDate = parse(nextValue, "yyyy-MM-dd", new Date());
				
				const nextDatesSelection = {
					...prev,
					[which]: which === "start" ? parsedDate : add(parsedDate, {
						days: 1,
						minutes: -1,
					}),
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
		console.log("closing");
		
		closeDialog();
	};
	
	const handleCreateSubmit = () => {
		const reason = inputRefs.reason.current?.value as PreferenceReason;
		const importance = inputRefs.importance.current?.value as PreferenceImportance;
		
		createPreference({
			id: Math.round(Math.random() * 500_000).toString(),
			userId,
			reason,
			importance,
			description,
			startDate: datesSelection.start,
			endDate: datesSelection.end,
		});
		
		closeDialog();
	};
	
	const handleDescriptionBlur: React.FocusEventHandler<HTMLTextAreaElement> = (event) => {
		const nextDescription = event.target.value.trim();
		event.target.value = nextDescription;
		setDescription(nextDescription);
	};
	
	React.useEffect(() => {
		// The `!` operator is used here because the refs must be
		// attached when `useEffect` runs, as these hooks execute after the DOM was mounted
		inputRefs.reason.current!.value = PreferenceReason.VACATION;
		inputRefs.importance.current!.value = PreferenceImportance.NORMAL_PRIORITY_NOT_TO;
		setDescription("");
		inputRefs.description.current!.value = "";
	}, [ isOpen ]);

	return (
		<div>
			<FloatingDialogClassicHeader handleClose={closeDialog} />
			<div className="flex flex-row">
				<div>
					<label
						htmlFor="preference-start-date"
						className="block"
					>
						החל מ
					</label>
					<input
						type="date"
						id="preference-start-date"
						className="text-black"
						value={format(datesSelection.start, "yyyy-MM-dd")}
						onChange={startDateChangeHandler}
						required
					/>
				</div>
				<div>
					<label
						htmlFor="preference-end-date"
						className="block"
					>
						עד
					</label>
					<input
						type="date"
						id="preference-end-date"
						className="text-black"
						value={format(datesSelection.end, "yyyy-MM-dd")}
						onChange={endDateChangeHandler}
						required
					/>
				</div>
			</div>
			{
				(datesSelection.start > datesSelection.end) &&
				<p>
					Reorder dates.
				</p>
			}
			{isTherePreferenceFallInDateRange &&
				<p className="alert alert-error">
					כבר הוגשה הסתייגות בטווח התאריכים החדש
				</p>
			}
			<div className="flex flex-row">
				<div>
					<label
						htmlFor="preference-reason-select"
						className="block"
					>
						סיבה
					</label>
					<select
						name="preference-reason"
						id="preference-reason-select"
						ref={inputRefs.reason}
					>
						{
							Object.keys(PreferenceReason).map((reason) => (
								<option
									value={reason}
									key={`preference-reason-option-${reason}`}
									className="bg-red-300"
								>
									{reason}
								</option>
							))
						}
					</select>
				</div>
				<div>
					<label
						htmlFor="preference-importance-select"
						className="block"
					>
						רמת חשיבות
					</label>
					<select
						name="preference-importance"
						id="preference-importance-select"
						ref={inputRefs.importance}
					>
						{
							Object.keys(PreferenceImportance).map((importance) => (
								// Only the admin can declare that someone is temporarily absent from doing duties
								importance !== PreferenceImportance.ABSENT &&
								<option
									value={importance}
									key={`preference-importance-option-${importance}`}
								>
									{importance}
								</option>
							))
						}
					</select>
				</div>
			</div>
			<div>
				<label
					htmlFor="preference-description"
					className="block"
				>
					תיאור*
				</label>
				<textarea
					id="preference-description"
					maxLength={40}
					ref={inputRefs.description}
					className="resize-none rounded-xl border-2 border-black"
					onBlur={handleDescriptionBlur}
				/>
			</div>
			<div className="flex justify-end">
				<button
					onClick={handleCancel}
					className="btn-clear"
				>
					ביטול
				</button>
				<button
					type="submit"
					disabled={description.replaceAll(" ", "").length < MIN_PREFERENCE_DETAILS_LENGTH}
					onClick={handleCreateSubmit}
					className="btn btn-purple"
				>
					שמירה
				</button>
			</div>
		</div>
	);
};
