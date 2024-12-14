"use client";

import { Dialog } from "@/app/_components/dialog/dialog";
import { Button } from "@/app/_components/ui/button";
import { PeriodEditRow } from "@/app/user-dashboard/profile/[userId]/[role]/components/periods-editor-dialog/period-edit-row";
import { PeriodInsertRow } from "@/app/user-dashboard/profile/[userId]/[role]/components/periods-editor-dialog/period-insert-button";
import { RetireDateEdit } from "@/app/user-dashboard/profile/[userId]/[role]/components/periods-editor-dialog/retire-date-edit";
import { createId } from "@paralleldrive/cuid2";
import { type Period } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PeriodsEditorDialogProps {
	isOpen: boolean;
	initialPeriods: Period[];
	closeDialog: () => void;
	replacePeriodsWith: (nextPeriods: Period[]) => Promise<void>;
}

export function PeriodsEditorDialog(props: PeriodsEditorDialogProps) {
	const [ proposedPeriods, setProposedPeriods ] = useState<Period[]>([
		...props.initialPeriods,
	]);
	
	const router = useRouter();
	
	const lastPeriod = proposedPeriods.at(-1);
	
	function applyChanges() {
		const formattedNextPeriods = proposedPeriods.map((currPeriod, i) => {
			currPeriod.id = createId();
			
			const nextPeriod = proposedPeriods[i + 1];
			
			if (nextPeriod) {
				currPeriod.endDate = nextPeriod.startDate;
			}
			
			return currPeriod;
		});
		
		props.replacePeriodsWith(formattedNextPeriods)
			.then(() => {
				router.refresh();
			});
	}
	
	function resetProposedPeriods() {
		setProposedPeriods(props.initialPeriods);
	}
	
	return (
		<>
			<Dialog
				isOpen={props.isOpen}
				className="relative overflow-y-scroll md:h-[80vh] md:w-[80vw] md:overflow-hidden"
			>
				<h3 className="text-center text-3xl font-bold">
					עריכת תפקידים
				</h3>
				<table className="w-full">
					<thead>
						<tr className="[&_th]:text-start">
							<th>תאריך התחלה</th>
							<th>תפקיד</th>
							<th>סטטוס</th>
							<th>פירוט</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						<PeriodInsertRow
							index={0}
							insertMode="before"
							setProposedPeriods={setProposedPeriods}
						/>
						{
							proposedPeriods.map((period, index) => (
								<>
									<PeriodEditRow
										key={period.id}
										period={period}
										setProposedPeriods={setProposedPeriods}
										canDeletePeriod={proposedPeriods.length > 1}
									/>
									<PeriodInsertRow
										key={`${period.id}-insert-after`}
										index={index}
										insertMode="after"
										setProposedPeriods={setProposedPeriods}
									/>
								</>
							))
						}
					</tbody>
				</table>
				{
					lastPeriod &&
					<RetireDateEdit
						lastPeriod={lastPeriod}
						setPeriods={setProposedPeriods}
					/>
				}
				<div className="absolute bottom-0 flex w-full justify-end p-2">
					<Button
						onClick={() => {
							resetProposedPeriods();
							props.closeDialog();
						}}
						variant="ghost"
					>
						ביטול
					</Button>
					<Button onClick={() => {
						applyChanges();
						props.closeDialog();
					}}
					>
						החלת השינויים
					</Button>
				</div>
			</Dialog>
		</>
	);
};
