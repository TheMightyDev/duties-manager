import { PeriodRecord } from "@/app/user-dashboard/profile/[userId]/[role]/profile-data-components/period-record";
import { type Period } from "@prisma/client";

interface PeriodsContainerProps {
	periods: Period[];
}

export function PeriodsContainer({ periods }: PeriodsContainerProps) {
	const currentDate = new Date();
	const currentPeriod: Period | undefined = periods.find((period) => currentDate > period.startDate && currentDate < period.endDate);
	
	return (
		<div className="flex flex-col gap-2 py-3 ps-6">
			
			<ol className="relative border-s border-slate-600 dark:border-gray-700">
				{
					periods.map((period) => (
						<PeriodRecord
							key={period.id}
							period={period}
							isCurrentPeriod={currentPeriod === period}
						/>
					))
				}
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
