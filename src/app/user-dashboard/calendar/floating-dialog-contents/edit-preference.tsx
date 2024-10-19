"use client";

import { FloatingDialogClassicHeader } from "@/app/_components/floating-dialog/helpers/classic-header";
import { MIN_PREFERENCE_DETAILS_LENGTH } from "@/app/_utils/constants";
import { type DatesSelection, type GetPreferenceParams, type PreferenceOperations } from "@/app/user-dashboard/types";
import { PreferenceImportance, PreferenceReason, type Preference } from "@prisma/client";
import { add, format, parse } from "date-fns";
import React from "react";

interface EditPreferenceProps extends PreferenceOperations<void> {
	isOpen: boolean;
	preference: Preference;
	getPreference: (params: GetPreferenceParams) => Preference | undefined;
	closeDialog: () => void;
}

export function EditPreference({
	preference,
	
	getPreference,
	updatePreference,
	deletePreference,
	closeDialog,
}: EditPreferenceProps) {
	const [ datesSelection, setDatesSelection ] = React.useState<DatesSelection>({
		start: preference.startDate,
		end: preference.endDate,
	});
	
	React.useEffect(() => {
		inputRefs.description.current!.value = preference.description;
	}, [ preference.description ]);
	
	React.useEffect(() => {
		setDatesSelection({
			start: preference.startDate,
			end: preference.endDate,
		});
	}, [ preference.startDate, preference.endDate ]);
	
	const inputRefs = {
		reason: React.useRef<HTMLSelectElement>(null),
		importance: React.useRef<HTMLSelectElement>(null),
		description: React.useRef<HTMLTextAreaElement>(null),
	};
	
	const isTherePreferenceFallInDateRange = React.useMemo(() => (
		getPreference({
			datesSelection,
			excludedPreferenceId: preference.id,
		}) !== undefined
	), [ datesSelection ]);
	
	const generalSetDateChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, which: "start" | "end") => {
		const nextValue = event.target.value;
		console.log("nextValue", nextValue);
		
		setDatesSelection((prev) => {
			const parsedDate = parse(nextValue, "yyyy-MM-dd", new Date());
				
			const nextDatesSelection = {
				...prev,
				[which]: which === "start" ? parsedDate : add(parsedDate, {
					days: 1,
					minutes: -1,
				}),
			};
			
			const existingPreferenceOnNewDateRange = getPreference({
				datesSelection: nextDatesSelection,
				excludedPreferenceId: preference.id,
			});
			
			console.log("@existingPreferenceOnNewDateRange", existingPreferenceOnNewDateRange);
			
			if (!existingPreferenceOnNewDateRange) {
				updatePreference({
					id: preference.id,
					startDate: nextDatesSelection.start,
					endDate: nextDatesSelection.end,
				});
			}
				
			return nextDatesSelection;
		});
	};
	
	const startDateChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
		generalSetDateChangeHandler(event, "start");
	};
	
	const endDateChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
		generalSetDateChangeHandler(event, "end");
	};

	const handleReasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const nextReason = event.target.value as PreferenceReason;
		
		updatePreference({
			id: preference.id,
			reason: nextReason,
		});
	};
	
	const handleImportanceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const nextImportance = event.target.value as PreferenceImportance;
		
		updatePreference({
			id: preference.id,
			importance: nextImportance,
		});
	};
	
	const handleDescriptionInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
		const nextDescription = event.currentTarget.value.trim();
		event.currentTarget.value = nextDescription;
		
		if (nextDescription.replaceAll(" ", "").length >= MIN_PREFERENCE_DETAILS_LENGTH) {
			updatePreference({
				id: preference.id,
				description: nextDescription,
			});
		} else {
			// This prevents the user from emptying the description area (to emphasize the changes were not applied)
			event.currentTarget.value = preference.description;
		}
	};
	
	const handleDelete = () => {
		deletePreference({
			id: preference.id,
		});
		closeDialog();
	};
	
	return (
		<div>
			<FloatingDialogClassicHeader handleClose={closeDialog} />
			<pre>
				{datesSelection.start.toUTCString()}
			</pre>
			<pre>
				{datesSelection.end.toUTCString()}
			</pre>
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
					>סיבה</label>
					<select
						name="preference-reason"
						id="preference-reason-select"
						ref={inputRefs.reason}
						value={preference.reason}
						onChange={handleReasonChange}
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
						value={preference.importance}
						onChange={handleImportanceChange}
					>
						{
							Object.keys(PreferenceImportance).map((importance) => (
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
					onBlur={handleDescriptionInput}
					className="resize-none rounded-xl border-2 border-black"
				/>
			</div>
			<div className="flex justify-end">
				<button
					onClick={handleDelete}
					className="btn-clear"
				>
					מחיקה
				</button>
				<button
					onClick={closeDialog}
					className="btn btn-purple"
				>
					אישור
				</button>
			</div>
		</div>
	);
};
