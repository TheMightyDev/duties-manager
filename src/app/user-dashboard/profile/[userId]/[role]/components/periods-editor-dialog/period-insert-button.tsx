import { createId } from "@paralleldrive/cuid2";
import { type Period } from "@prisma/client";
import { addDays, subDays } from "date-fns";

interface PeriodInsertButtonProps {
	index: number;
	insertMode: "before" | "after";
	setProposedPeriods: React.Dispatch<React.SetStateAction<Period[]>>;
}

export function PeriodInsertButton({
	index,
	insertMode,
	setProposedPeriods,
}: PeriodInsertButtonProps) {
	function insertPeriod() {
		setProposedPeriods((prev) => {
			const existingPeriod = prev[index];
			
			if (!existingPeriod) {
				return prev;
			}
			
			const addedPeriod: Period =	{
				...existingPeriod,
				id: createId(),
				description: null,
				startDate: insertMode === "before"
					? subDays(existingPeriod.startDate, 10)
					: addDays(existingPeriod.startDate, 10),
			};
			
			return prev.toSpliced(
				index + (insertMode === "after" ? 1 : 0),
				0,
				addedPeriod
			);
		});
	}
	
	return (
		<button
			className="bg-blue-300"
			onClick={insertPeriod}
		>
			+
		</button>
	);
};
