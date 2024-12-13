"use client";

import { Dialog } from "@/app/_components/dialog/dialog";
import { Button } from "@/app/_components/ui/button";
import { PeriodEditRecord } from "@/app/user-dashboard/profile/[userId]/[role]/components/periods-editor-dialog/period-edit-record";
import { PeriodInsertButton } from "@/app/user-dashboard/profile/[userId]/[role]/components/periods-editor-dialog/period-insert-button";
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
				<div className="flex flex-col gap-2 overflow-y-scroll md:max-h-[70vh] ">
					<PeriodInsertButton
						index={0}
						insertMode="before"
						setProposedPeriods={setProposedPeriods}
					/>
					{
						proposedPeriods.map((period, index) => (
							<>
								<PeriodEditRecord
									key={period.id}
									period={period}
									setProposedPeriods={setProposedPeriods}
									canDeletePeriod={proposedPeriods.length > 1}
								/>
								<PeriodInsertButton
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
