import { formatDate } from "@/app/_utils/date-format-utils";
import { type Period } from "@prisma/client";

interface PeriodsContainerProps {
	periods: Period[];
}

export function PeriodsContainer({ periods }: PeriodsContainerProps) {
	return (
		<div className="flex flex-col p-2">
			{
				periods.map((period) => {
					return (
						<div className="flex flex-row">
							{period.role}
							{formatDate(period.startDate)} - {formatDate(period.endDate)}
						</div>
					);
				})
			}
		</div>
	);
};
