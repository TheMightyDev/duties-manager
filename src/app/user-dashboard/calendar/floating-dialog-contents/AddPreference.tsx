"use client";

import { type DatesSelection, type GetPreferenceParams, type PreferenceOperations } from "@/app/user-dashboard/types";
import { PreferenceImportance, PreferenceReason, type Preference } from "@prisma/client";
import { add, format, parse } from "date-fns";
import React from "react";

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
	const inputRefs = {
		reason: React.useRef<HTMLSelectElement>(null),
		importance: React.useRef<HTMLSelectElement>(null),
		description: React.useRef<HTMLTextAreaElement>(null),
	};
	
	const isTherePreferenceFallInDateRange = React.useMemo(() => (
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
		const description = inputRefs.description.current?.value as string;
		
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
	
	React.useEffect(() => {
		inputRefs.reason.current!.value = PreferenceReason.VACATION;
		inputRefs.importance.current!.value = PreferenceImportance.NORMAL_PRIORITY;
		inputRefs.description.current!.value = "";
	}, [ isOpen ]);

	return (
		<div>
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
					>סיבה</label>
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
					פירוט
				</label>
				<textarea
					id="preference-description"
					maxLength={40}
					ref={inputRefs.description}
					className="resize-none rounded-xl border-2 border-black"
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
					disabled={isTherePreferenceFallInDateRange}
					onClick={handleCreateSubmit}
					className="btn btn-purple"
				>
					שמירה
				</button>
			</div>
		</div>
	);
};
