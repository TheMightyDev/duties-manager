import { createId } from "@paralleldrive/cuid2";
import { PeriodStatus, type Period } from "@prisma/client";
import { addDays, subDays } from "date-fns";

interface PeriodInsertButtonProps {
	index: number;
	insertMode: "before" | "after";
	setProposedPeriods: React.Dispatch<React.SetStateAction<Period[]>>;
}

export function PeriodInsertRow({
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
				status: PeriodStatus.FULFILLS_ROLE,
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
		<tr>
			<td colSpan={5}>
				<button
					className="w-full bg-blue-300"
					onClick={insertPeriod}
				>
					+
				</button>
			</td>
		</tr>
	);
};
