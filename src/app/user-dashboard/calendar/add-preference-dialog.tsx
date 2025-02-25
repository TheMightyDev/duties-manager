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

export function AddPreferenceDialog({
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
}: AddPreferenceDialogProps) {
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
			inputRefs.importance.current!.value = PreferenceImportance.NORMAL_PRIORITY_NOT_TO;
			inputRefs.description.current!.value = "";
		}
	}, [ isOpen ]);

	return (
		<div className="dialog-backdrop">
			<div className="absolute inset-0 m-auto bg-white [height:100vh] [width:100vw] md:size-96 md:rounded-xl">
				<div className="h-12"></div>
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
				{preference &&
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
									importance !== PreferenceImportance.NO_DUTIES &&
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
					<label htmlFor="preference-description">
						פירוט
					</label>
					<textarea
						id="preference-description"
						maxLength={40}
						ref={inputRefs.description}
						className="resize-none rounded-xl border-2 border-black"
					/>
				</div>
				<div className="absolute bottom-1 end-1">
					{
						mode === AddPreferenceDialogMode.EDIT &&
						<button
							onClick={handleDelete}
							className="btn btn-green"
						>
							מחיקה
						</button>
					}
					<button
						onClick={handleCancel}
						className="btn btn-purple"
					>
						ביטול
					</button>
					{
						mode === AddPreferenceDialogMode.ADD &&
						<button
							type="submit"
							disabled={preference}
							onClick={handleCreateSubmit}
							className="btn btn-purple"
						>
							הגשת הסתייגות
						</button>
					}
					{
						mode === AddPreferenceDialogMode.EDIT &&
						<button
							type="submit"
							disabled={preference}
							onClick={handleUpdateSubmit}
							className="btn btn-purple"
						>
							החלת השינויים
						</button>
					}
				</div>
			</div>
		</div>
	);
};
