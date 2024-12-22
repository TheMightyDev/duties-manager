import { PeriodStatusInfoBox } from "@/app/user-dashboard/profile/[userId]/[role]/components/period-status-info-box";
import { ProfileMetricBox } from "@/app/user-dashboard/profile/[userId]/[role]/components/profile-metric-box";
import { type UserJustice } from "@/types/justice/user-justice";
import { type RoleRecord } from "@/types/user/role-record";
import { useTranslations } from "next-intl";

interface ProfileInfoBoxesProps {
	userJustice: UserJustice;
	userPosition: number;
	totalRelevantUsersCount: number;
	roleRecords: RoleRecord[];
}

export function ProfileInfoBoxes(props: ProfileInfoBoxesProps) {
	const t = useTranslations();
	
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
		<div>
			<div className="flex w-full flex-col gap-2 md:min-w-96">
				<div className="flex flex-row gap-2 ">
					<ProfileMetricBox
						title={t("JusticeMetric.weighted-score")}
						value={weightedScore.toFixed(2)}
						infoMessage={t("JusticeMetricExplanation.weighted-score")}
					/>
					<ProfileMetricBox
						title={t("JusticeMetric.position-in-role")}
						value={props.userPosition}
						infoMessage={t(`JusticeMetricExplanation.position-in-role.${isEarlyRole ? "past-role" : "present-role"}`)}
						valueSuffix={
							<span className="text-xl">
								{`/${props.totalRelevantUsersCount}`}
							</span>
						}
					/>
				</div>
				<div className="flex flex-row gap-2">
					<ProfileMetricBox
						title={t("JusticeMetric.months-in-role")}
						value={monthsInRole.toFixed(2)}
						infoMessage={t("JusticeMetricExplanation.months-in-role")}
					/>
					<PeriodStatusInfoBox
						isEarlyRole={isEarlyRole}
						status={latestPeriodStatus}
					/>
				</div>
				<div className="flex flex-row gap-2">
					<ProfileMetricBox
						title={t("JusticeMetric.guarding-in-weekday")}
						value={weekdaysGuardingCount}
					/>
					<ProfileMetricBox
						title={t("JusticeMetric.guarding-in-weekends")}
						value={weekendsGuardingCount}
					/>
					<ProfileMetricBox
						title={t("JusticeMetric.camp-and-settlement-defense-count")}
						value={campAndSettlementDefenseCount}
						infoMessage={t("JusticeMetricExplanation.camp-and-settlement-defense-count")}
					/>
				</div>
				<div className="flex flex-row gap-2">
					<ProfileMetricBox
						title={t("JusticeMetric.holiday-overlaps")}
						value={holidayOverlapsCount}
						infoMessage={t("JusticeMetricExplanation.holiday-overlaps")}
					/>
					<ProfileMetricBox
						title={t("JusticeMetric.more-duties")}
						value={otherDutiesScoreSum}
						valueSuffix={<span className="text-xl">{t("General.pts")}</span>}
					/>
					<ProfileMetricBox
						title={t("JusticeMetric.total-bonuses")}
						value={extraScoresSum}
						valueSuffix={<span className="text-xl">{t("General.pts")}</span>}
					/>
				</div>
			</div>
		</div>
	);
};
