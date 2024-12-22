"use client";

import { Button } from "@/app/_components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/_components/ui/dialog";
import { PeriodEditRow } from "@/app/user-dashboard/profile/[userId]/[role]/components/periods-editor-dialog/period-edit-row";
import { PeriodInsertRow } from "@/app/user-dashboard/profile/[userId]/[role]/components/periods-editor-dialog/period-insert-button";
import { RetireDateEdit } from "@/app/user-dashboard/profile/[userId]/[role]/components/periods-editor-dialog/retire-date-edit";
import { createId } from "@paralleldrive/cuid2";
import { type Period } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

interface PeriodsEditorDialogProps {
	isOpen: boolean;
	initialPeriods: Period[];
	setIsOpen: (nextIsOpen: boolean) => void;
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
				open={props.isOpen}
				onOpenChange={props.setIsOpen}
			>
				<DialogContent className="max-h-[90vh] max-w-fit overflow-y-scroll">
					<DialogHeader >
						<DialogTitle className="text-center">עריכת תפקידים</DialogTitle>
					</DialogHeader>
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
									<Fragment key={period.id}>
										<PeriodEditRow
											period={period}
											setProposedPeriods={setProposedPeriods}
											canDeletePeriod={proposedPeriods.length > 1}
										/>
										<PeriodInsertRow
											index={index}
											insertMode="after"
											setProposedPeriods={setProposedPeriods}
										/>
									</Fragment>
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
								props.setIsOpen(false);
							}}
							variant="ghost"
						>
							ביטול
						</Button>
						<Button onClick={() => {
							applyChanges();
							props.setIsOpen(false);
						}}
						>
							החלת השינויים
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};
