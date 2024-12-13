"use client";

import { LockSvgIcon } from "@/app/_components/svg-icons/ui/lock-svg-icon";
import { PenLineSvgIcon } from "@/app/_components/svg-icons/ui/pen-line-svg-icon";
import { Alert, AlertDescription, AlertTitle } from "@/app/_components/ui/alert";
import { Button } from "@/app/_components/ui/button";
import { PeriodRecord } from "@/app/user-dashboard/profile/[userId]/[role]/components/period-record";
import { PeriodsEditorDialog } from "@/app/user-dashboard/profile/[userId]/[role]/components/periods-editor-dialog/periods-editor-dialog";
import { PeriodStatus, UserRole, type Period } from "@prisma/client";
import { useState } from "react";

interface PeriodsContainerProps {
	periods: Period[];
	isLoggedUserAdmin: boolean;
}

export function PeriodsContainer({
	periods,
	isLoggedUserAdmin,
}: PeriodsContainerProps) {
	const [ isEditorDialogOpen, setIsEditorDialogOpen ] = useState(false);
	
	if (periods.length === 0) {
		return <>No periods found for user</>;
	}
	
	const currentDate = new Date();
	const currentPeriod: Period | undefined = periods.find((period) => currentDate > period.startDate && currentDate < period.endDate);
	
	// It cannot be `undefined` as there must be at least one period
	const retireDate = periods.at(-1)!.endDate;
	const retirePeriod: Period = {
		id: "retire",
		// It cannot be `undefined` as there must be at least one period
		userId: periods[0]!.userId,
		description: "שחרור",
		role: UserRole.EXEMPT,
		startDate: retireDate,
		endDate: retireDate,
		status: PeriodStatus.TEMPORARILY_ABSENT,
	};
	
	return (
		<>
			<PeriodsEditorDialog
				isOpen={isEditorDialogOpen}
				initialPeriods={periods}
				closeDialog={() => {
					setIsEditorDialogOpen(false);
				}}
				applyChanges={() => {
					alert("TODO");
				}}
			/>
			{
				isLoggedUserAdmin &&
				<Button onClick={() => {
					setIsEditorDialogOpen(true);
				}}
				>
					עריכת הסתייגויות
					<PenLineSvgIcon className="stroke-white"/>
				</Button>
			}
			{
				(!isLoggedUserAdmin) &&
				<Alert variant="default">
					<LockSvgIcon className="size-6 stroke-black"/>
					<AlertTitle>
						מידע אישי
					</AlertTitle>
					<AlertDescription>
						המידע שמוצג כאן מוצג רק לך ולאחראי.ות
					</AlertDescription>
				</Alert>
			}
			<div className="flex flex-col gap-2 py-3 ps-6">
			
				<ol className="relative border-s border-slate-600 dark:border-gray-700">
					{
						periods.map((period) => (
							<PeriodRecord
								period={period}
								isCurrentPeriod={currentPeriod === period}
								key={period.id}
							/>
						))
					}
					<PeriodRecord
						period={retirePeriod}
						isCurrentPeriod={new Date() > retirePeriod.startDate}
						isLastPeriod={true}
						key={retirePeriod.id}
					/>
				</ol>
			</div>
		</>
	);
};
