import { PeriodRecord } from "@/app/user-dashboard/profile/[userId]/[role]/profile-data-components/period-record";
import { PeriodStatus, UserRole, type Period } from "@prisma/client";

interface PeriodsContainerProps {
	periods: Period[];
}

export function PeriodsContainer({ periods }: PeriodsContainerProps) {
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
			{/* {
				periods.map((period) => (
					<PeriodRecord
						period={period}
						isCurrentPeriod={period === currentPeriod}
					/>
				))
			} */}
		</div>
	);
};
