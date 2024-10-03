"use client";

import { type DatesSelection, type GetPreferenceParams, type PreferenceOperations } from "@/app/user-dashboard/types";
import { PreferenceImportance, PreferenceReason, type Preference } from "@prisma/client";
import { add, format, parse } from "date-fns";
import React from "react";

export enum AddPreferenceDialogMode {
	ADD,
	EDIT,
}

interface AddPreferenceDialogProps extends PreferenceOperations<void> {
	isOpen: boolean;
	mode: AddPreferenceDialogMode;
	userId: string;
	datesSelection: DatesSelection;
	setDatesSelection: React.Dispatch<React.SetStateAction<DatesSelection | null>>;
	/** Required if on "edit" mode */
	selectedPreference?: Preference;
	
	getPreference: (params: GetPreferenceParams) => Preference | undefined;
	closeDialog: () => void;
}

export const AddPreferenceDialog: React.FC<AddPreferenceDialogProps> = ({
	mode,
	isOpen,
	userId,
	datesSelection,
	setDatesSelection,
	selectedPreference,
	
	getPreference,
	createPreference,
	deletePreference,
	updatePreference,
	closeDialog,
}) => {
	const inputRefs = {
		reason: React.useRef<HTMLSelectElement>(null),
		importance: React.useRef<HTMLSelectElement>(null),
		description: React.useRef<HTMLTextAreaElement>(null),
	};
	
	const preference = getPreference({
		datesSelection,
		excludedPreferenceId: selectedPreference?.id,
	}) !== undefined;
	console.log("@preference", preference);
	
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
	
	const handleUpdateSubmit = () => {
		if (!selectedPreference) {
			return;
		}
		
		const reason = inputRefs.reason.current?.value as PreferenceReason;
		const importance = inputRefs.importance.current?.value as PreferenceImportance;
		const description = inputRefs.description.current?.value as string;
		
		updatePreference({
			id: selectedPreference.id,
			userId: selectedPreference.userId,
			reason,
			importance,
			description,
			startDate: datesSelection.start,
			endDate: datesSelection.end,
		});
		
		closeDialog();
	};
	
	const handleDelete = () => {
		if (selectedPreference) {
			deletePreference({
				id: selectedPreference.id,
			});
		}
		
		closeDialog();
	};
	
	React.useEffect(() => {
		if (mode === AddPreferenceDialogMode.EDIT && selectedPreference) {
			inputRefs.reason.current!.value = selectedPreference.reason;
			inputRefs.importance.current!.value = selectedPreference.importance;
			inputRefs.description.current!.value = selectedPreference.description;
		} else {
			inputRefs.reason.current!.value = PreferenceReason.VACATION;
			inputRefs.importance.current!.value = PreferenceImportance.NORMAL_PRIORITY;
			inputRefs.description.current!.value = "";
		}
	}, [ isOpen ]);

	return (
		<div className="bg-black bg-opacity-50 inset-0 z-10  fixed">
			<div className="bg-white absolute top-0 left-0 right-0 m-auto bottom-0 [width:100vw] [height:100vh] md:w-96 md:h-96 md:rounded-xl">
				<div className="h-12"></div>
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
								<option
									value={reason}
									key={`preference-reason-option-${reason}`}
									className="bg-red-300">
									{reason}
								</option>
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
								// Only the admin can declare that someone is temporarily absent from doing duties
								importance !== PreferenceImportance.ABSENT &&
								<option
									value={importance}
									key={`preference-importance-option-${importance}`}>
									{importance}
								</option>
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
					{
						mode === AddPreferenceDialogMode.EDIT &&
						<button onClick={handleDelete}>
							מחיקה
						</button>
					}
					<button onClick={handleCancel}>
						ביטול
					</button>
					{
						mode === AddPreferenceDialogMode.ADD &&
						<button
							type="submit"
							disabled={preference}
							onClick={handleCreateSubmit}>
							הגשת הסתייגות
						</button>
					}
					{
						mode === AddPreferenceDialogMode.EDIT &&
						<button
							type="submit"
							disabled={preference}
							onClick={handleUpdateSubmit}>
							החלת השינויים
						</button>
					}
				</div>
			</div>
		</div>
	);
};
