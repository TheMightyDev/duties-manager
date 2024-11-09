import { PeriodStatusInfoBox } from "@/app/user-dashboard/profile/[userId]/[role]/PeriodStatusInfoBox";
import { type UserJustice } from "@/types/justice/user-justice";

interface ProfileInfoBoxesProps {
	userJustice: UserJustice;
	userPosition: number;
	totalRelevantUsersCount: number;
}

export function ProfileInfoBoxes(props: ProfileInfoBoxesProps) {
	const {
		weightedScore,
		monthsInRole,
		latestPeriodStatus,
		weekdaysGuardingCount,
		weekendsGuardingCount,
		otherDutiesScoreSum,
	} = props.userJustice;
	
	const className = "flex flex-col rounded-xl bg-slate-200 p-4 hover:bg-slate-300 flex-1 text-center";

	return (
		<div className="flex w-full flex-col gap-2">
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
					className={className}
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
	);
};
