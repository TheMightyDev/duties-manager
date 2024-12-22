import { ProfileMetricBoxSkeleton } from "@/app/user-dashboard/profile/[userId]/[role]/skeletons/profile-metric-box-skeleton";
import { useTranslations } from "next-intl";

export function ProfileInfoBoxesSkeleton() {
	// `next-intl` knows how to turn this "hook" call into an eligible function on server
	const t = useTranslations();
	
	return (
		<div>
			<div className="flex w-full animate-pulse flex-col gap-2 md:min-w-96">
				<div className="flex flex-row gap-2">
					<ProfileMetricBoxSkeleton
						title={t("JusticeMetric.weighted-score")}
						value="0.00"
						hasInfoMessage={true}
					/>
					<ProfileMetricBoxSkeleton
						title={t("JusticeMetric.position-in-role")}
						value={1}
						hasInfoMessage={true}
						valueSuffix={<span className="text-xl">{"/10"}</span>}
					/>
				</div>
				<div className="flex flex-row gap-2">
					<ProfileMetricBoxSkeleton
						title="חודשים בתפקיד"
						value="00.00"
						hasInfoMessage={true}
					/>
					<div className= "flex flex-1 flex-col rounded-xl bg-slate-200 p-3 text-center sm:p-4">
						<div className="m-auto my-2 h-8 w-14 rounded-xl bg-gray-300"></div>
						<div className="h-4 w-full rounded-xl bg-gray-300"></div>
					</div>
				</div>
				<div className="flex flex-row gap-2">
					<ProfileMetricBoxSkeleton
						title="שמירות ביום חול"
						value={0}
						hasInfoMessage={false}
					/>
					<ProfileMetricBoxSkeleton
						title='שמירות בסופ"ש'
						value={0}
						hasInfoMessage={false}
					/>
					<ProfileMetricBoxSkeleton
						title='הגנמ"שים'
						value="0.00"
						hasInfoMessage={true}
					/>
				</div>
				<div className="flex flex-row gap-2">
					<ProfileMetricBoxSkeleton
						title="חפיפות עם חגים"
						value={0}
						hasInfoMessage={true}
					/>
					<ProfileMetricBoxSkeleton
						title="תורנויות נוספות"
						value={0}
						hasInfoMessage={false}
					/>
					<ProfileMetricBoxSkeleton
						title="סך הבונוסים"
						value={0}
						hasInfoMessage={false}
					/>
				</div>
			</div>
		</div>
	);
};
