import { TrashSvgIcon } from "@/app/_components/svg-icons/ui/trash-svg-icon";
import { Button } from "@/app/_components/ui/button";
import { formatDate } from "@/app/_utils/date-format-utils";
import { type Period } from "@prisma/client";

interface PeriodEditRecordProps {
	period: Period;
	setProposedPeriods: React.Dispatch<React.SetStateAction<Period[]>>;
	canDeletePeriod: boolean;
}

export function PeriodEditRecord({
	period,
	setProposedPeriods,
	canDeletePeriod,
}: PeriodEditRecordProps) {
	console.log(formatDate(period.startDate));
	
	function handleStartDateChange(event: React.ChangeEvent<HTMLInputElement>) {
		const selectedDate = event.currentTarget.value;
		setProposedPeriods((prev) => {
			const affectedPeriodIndex = prev.findIndex((curr) => curr === period);
			
			if (!prev[affectedPeriodIndex]) {
				return prev;
			}
			
			prev[affectedPeriodIndex].startDate = new Date(selectedDate);
			
			return [ ...prev ];
		});
	}
	
	function deletePeriod() {
		setProposedPeriods((prev) => {
			const periodIndex = prev.findIndex((curr) => curr === period);
			
			return prev.toSpliced(periodIndex, 1);
		});
	}
	
	return (
		<div className="flex w-full flex-row justify-between">
			<div className="flex flex-col">
				<label>
					תאריך התחלה
					<br />
					<input
						type="date"
						value={formatDate(period.startDate)}
						onChange={handleStartDateChange}
					/>
				</label>
			</div>
			<Button
				onClick={deletePeriod}
				className="size-10 p-0 text-xl [&_svg]:size-6"
				variant="ghost"
				disabled={!canDeletePeriod}
			>
				<TrashSvgIcon className="stroke-slate-600" />
			</Button >
		</div>
	);
};
