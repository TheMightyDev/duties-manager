import { PeriodStatusInfoBox } from "@/app/user-dashboard/profile/[userId]/[role]/components/period-status-info-box";
import { ProfileMetricBox } from "@/app/user-dashboard/profile/[userId]/[role]/components/profile-metric-box";
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
		campAndSettlementDefenseCount,
		holidayOverlapsCount,
		otherDutiesScoreSum,
		extraScoresSum,
	} = props.userJustice;
	
	const isEarlyRole = props.roleRecords.find((record) => record.role === role)?.latestFulfilledDate != null;

	return (
		<div className="p-2 md:p-0">
			<div className="flex w-full flex-col gap-2 md:min-w-96">
				<div className="flex flex-row gap-2 ">
					<ProfileMetricBox
						title="ניקוד משוקלל"
						value={weightedScore.toFixed(2)}
						infoMessage="סכום הנקודות שנצברו חלקי מס' החודשים בתפקיד בפועל"
					/>
					<ProfileMetricBox
						title="דירוג בתפקיד"
						value={props.userPosition}
						infoMessage={`המיקום בטבלת הצדק מבין כל האנשים בתפקיד
							${isEarlyRole ? "נכון לתאריך סיום ביצוע התפקיד" : "נכון להיום"}`}
						valueSuffix={
							<span className="text-xl">
								/{props.totalRelevantUsersCount}
							</span>
						}
					/>
				</div>
				<div className="flex flex-row gap-2">
					<ProfileMetricBox
						title="חודשים בתפקיד"
						value={monthsInRole.toFixed(2)}
						infoMessage="סך החודשים נכון להיום שמולא התפקיד (לא כולל היעדרויות ופטורים זמניים)"
					/>
					<PeriodStatusInfoBox
						isEarlyRole={isEarlyRole}
						status={latestPeriodStatus}
					/>
				</div>
				<div className="flex flex-row gap-2">
					<ProfileMetricBox
						title="שמירות ביום חול"
						value={weekdaysGuardingCount}
					/>
					<ProfileMetricBox
						title='שמירות בסופ"ש'
						value={weekendsGuardingCount}
					/>
					<ProfileMetricBox
						title='הגנמ"שים'
						value={campAndSettlementDefenseCount}
						infoMessage='מספר ההגנ"מים (הגנות מחנה) וההגנ"שים (הגנות יישובים)'
					/>
				</div>
				<div className="flex flex-row gap-2">
					<ProfileMetricBox
						title="חפיפות עם חגים"
						value={holidayOverlapsCount}
						infoMessage="מספר התורנויות שחפפו לחג כלשהו (לא תורם לסך התורנויות)"
					/>
					<ProfileMetricBox
						title="תורנויות נוספות"
						value={otherDutiesScoreSum}
						valueSuffix={<span className="text-xl">נק'</span>}
					/>
					<ProfileMetricBox
						title="סך הבונוסים"
						value={extraScoresSum}
						valueSuffix={<span className="text-xl">נק'</span>}
					/>
				</div>
			</div>
		</div>
	);
};
