import { PeriodStatusInfoBox } from "@/app/user-dashboard/profile/[userId]/[role]/components/period-status-info-box";
import { type UserJustice } from "@/types/justice/user-justice";
import { type RoleRecord } from "@/types/user/role-record";

interface ProfileInfoBoxesProps {
	userJustice: UserJustice;
	userPosition: number;
	totalRelevantUsersCount: number;
	roleRecords: RoleRecord[];
}

export function ProfileInfoBoxes(props: ProfileInfoBoxesProps) {
	const {
		role,
		weightedScore,
		monthsInRole,
		latestPeriodStatus,
		weekdaysGuardingCount,
		weekendsGuardingCount,
		otherDutiesScoreSum,
	} = props.userJustice;
	
	const className = "flex flex-col rounded-xl bg-slate-200 p-3 sm:p-4 hover:bg-slate-300 flex-1 text-center";
	
	const isEarlyRole = props.roleRecords.find((record) => record.role === role)?.latestFulfilledDate != null;

	return (
		<div className="p-2 md:p-0">
			<div className="flex w-full flex-col gap-2 md:min-w-96 ">
				<div className="flex flex-row gap-2">
					<div className={className}>
						<span className="text-4xl">{weightedScore}</span>
						<span>ניקוד משוקלל</span>
					</div>
					<div className={className}>
						<p><span className="text-4xl">{props.userPosition}</span><span className="text-xl">/{props.totalRelevantUsersCount}</span></p>
						<span>דירוג בתפקיד</span>
					</div>
				</div>
				<div className="flex flex-row gap-2">
					<div className={className}>
						<span className="text-4xl">{monthsInRole}</span>
						<span>חודשים בתפקיד</span>
					</div>
					<PeriodStatusInfoBox
						baseClassName={className}
						isEarlyRole={isEarlyRole}
						status={latestPeriodStatus}
					/>
				</div>
				<div className="flex flex-row gap-2">
					<div className={className}>
						<span className="text-4xl">{weekdaysGuardingCount}</span>
						<span>שמירות ביום חול</span>
					</div>
					<div className={className}>
						<span className="text-4xl">{weekendsGuardingCount}</span>
						<span>שמירות בסופ"ש</span>
					</div>
					<div className={className}>
						<p><span className="text-4xl">{otherDutiesScoreSum}</span>נק'</p>
						<span>תורנויות נוספות</span>
					</div>
				</div>
			</div>
		</div>
	);
};
