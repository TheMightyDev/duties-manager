import { formatDate } from "@/app/_utils/date-format-utils";
import { UTCDate } from "@date-fns/utc";
import { type Period } from "@prisma/client";
import React from "react";

interface RetireDateEditProps {
	lastPeriod: Period;
	setPeriods: React.Dispatch<React.SetStateAction<Period[]>>;
}

export function RetireDateEdit({
	lastPeriod,
	setPeriods,
}: RetireDateEditProps) {
	function handleRetireDateChange(event: React.ChangeEvent<HTMLInputElement>) {
		const nextDate = new UTCDate(event.currentTarget.value);
		
		setPeriods((prev) => {
			// It cannot be null because there must be at least one period,
			// otherwise the component won't work (it requires a period as prop)
			const lastPeriodInPrev = prev.at(-1)!;
			
			lastPeriodInPrev.endDate = nextDate;

			return [ ...prev ];
		});
	}
	
	return (
		<label>
			תאריך שחרור
			<br />
			<input
				type="date"
				value={formatDate(lastPeriod.endDate)}
				onChange={handleRetireDateChange}
			/>
		</label>
	);
};
