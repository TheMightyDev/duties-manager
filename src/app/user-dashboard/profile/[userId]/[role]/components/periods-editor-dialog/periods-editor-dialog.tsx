"use client";

import { Dialog } from "@/app/_components/dialog/dialog";
import { Button } from "@/app/_components/ui/button";
import { PeriodEditRow } from "@/app/user-dashboard/profile/[userId]/[role]/components/periods-editor-dialog/period-edit-row";
import { PeriodInsertRow } from "@/app/user-dashboard/profile/[userId]/[role]/components/periods-editor-dialog/period-insert-button";
import { RetireDateEdit } from "@/app/user-dashboard/profile/[userId]/[role]/components/periods-editor-dialog/retire-date-edit";
import { type Period } from "@prisma/client";
import { useState } from "react";

interface PeriodsEditorDialogProps {
	isOpen: boolean;
	initialPeriods: Period[];
	closeDialog: () => void;
	applyChanges: (newPeriods: Period[]) => void;
}

export function PeriodsEditorDialog(props: PeriodsEditorDialogProps) {
	const [ proposedPeriods, setProposedPeriods ] = useState<Period[]>(props.initialPeriods);
	
	const lastPeriod = proposedPeriods.at(-1);
	
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
						{
							lastPeriod &&
							<RetireDateEdit
								lastPeriod={lastPeriod}
								setPeriods={setProposedPeriods}
							/>
						}
					</tbody>
				</table>
				<div className="flex flex-col gap-2 overflow-y-scroll md:max-h-[70vh] ">
					
				</div>
				<div className="absolute bottom-0 flex w-full justify-end p-2">
					<Button
						onClick={props.closeDialog}
						variant="ghost"
					>
						ביטול
					</Button>
					<Button onClick={() => {
						props.applyChanges(proposedPeriods);
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
