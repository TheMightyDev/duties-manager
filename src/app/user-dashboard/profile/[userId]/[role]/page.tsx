import { ProfileHeader } from "@/app/user-dashboard/profile/[userId]/[role]/profile-header";
import { ProfileInfoBoxesWrapper } from "@/app/user-dashboard/profile/[userId]/[role]/profile-info-boxes-wrapper";
import { ProfileTabs } from "@/app/user-dashboard/profile/[userId]/[role]/profile-tabs";
import { ProfileHeaderSkeleton } from "@/app/user-dashboard/profile/[userId]/[role]/skeletons/profile-header-skeleton";
import { ProfileInfoBoxesSkeleton } from "@/app/user-dashboard/profile/[userId]/[role]/skeletons/profile-info-boxes-skeleton";
import { ProfileTabsSkeleton } from "@/app/user-dashboard/profile/[userId]/[role]/skeletons/profile-tabs-skeleton";
import { type ProfilePageUrlParams } from "@/app/user-dashboard/profile/[userId]/[role]/types";
import { Suspense } from "react";

interface UserProfilePageProps {
	params: Promise<ProfilePageUrlParams>;
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
	const extractedParams = await params;

	return (
		<>
			<Suspense fallback={<ProfileHeaderSkeleton />}>
				<ProfileHeader {...extractedParams}/>
			</Suspense>
			<div className="m-auto flex max-w-96 flex-col gap-2 lg:max-w-none lg:flex-row">
				<Suspense fallback={<ProfileInfoBoxesSkeleton />}>
					<ProfileInfoBoxesWrapper {...extractedParams} />
				</Suspense>
				<Suspense fallback={<ProfileTabsSkeleton userId={extractedParams.userId} />}>
					<ProfileTabs {...extractedParams} />
				</Suspense>
			</div>
		</>
	);
}
