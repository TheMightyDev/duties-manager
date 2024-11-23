import { DefinitiveDateKind } from "@/app/user-dashboard/justice/types";
import { endOfDay, endOfMonth, startOfMonth } from "date-fns";
import { type RefObject } from "react";

interface DefinitiveDateSelectorProps {
	kindSelectRef?: RefObject<HTMLSelectElement>;
	customDateInputRef?: RefObject<HTMLInputElement>;
	handleDefinitiveDateChange?: (nextDefinitiveDate: Date) => void;
}

function getActualDefinitiveDate({ kind, customDate }: {
	kind: DefinitiveDateKind;
	customDate?: Date;
}): Date {
	const currDate = new Date();
	
	switch (kind) {
		case DefinitiveDateKind.TODAY:
			return endOfDay(currDate);
		case DefinitiveDateKind.START_OF_CURRENT_MONTH:
			return startOfMonth(currDate);
		case DefinitiveDateKind.END_OF_CURRENT_MONTH:
			return endOfMonth(currDate);
		case DefinitiveDateKind.CUSTOM:
			return customDate ?? endOfMonth(currDate);
		// There's no need for default because one of
		// the kinds must be selected
	}
}

export function DefinitiveDateSelector(props: DefinitiveDateSelectorProps) {
	function handleOverallChange() {
		const customDateStr = props.customDateInputRef?.current?.value;
		
		const nextDefinitiveDate = getActualDefinitiveDate({
			kind: props.kindSelectRef?.current?.value as DefinitiveDateKind,
			customDate: customDateStr
				? new Date(customDateStr) : undefined,
		});
		
		console.log("customDate", props.customDateInputRef?.current?.value);
		
		props.handleDefinitiveDateChange?.(nextDefinitiveDate);
	}
	
	return (
		<div onChange={handleOverallChange}>
			<label>
				תאריך קובע
				<select
					ref={props.kindSelectRef}
					onChange={() => {
						const customDateInput = props.customDateInputRef?.current;
						if (customDateInput && props.kindSelectRef?.current?.value !== DefinitiveDateKind.CUSTOM) {
							customDateInput.value = "";
						}
					}}
				>
					{
						Object.entries(DefinitiveDateKind).map(([ id, value ]) => {
							return (
								<option
									value={value}
									key={id}
								>
									{value}
								</option>
							);
						})
					}
				</select>
			</label>
			
			<p>
				<label>
					בחירה אישית
					<input
						type="date"
						ref={props.customDateInputRef}
						onChange={() => {
							const kindSelect = props.kindSelectRef?.current;
							if (kindSelect) {
								kindSelect.value = DefinitiveDateKind.CUSTOM;
							}
						}}
					/>
				</label>
			</p>
		</div>
	);
};
