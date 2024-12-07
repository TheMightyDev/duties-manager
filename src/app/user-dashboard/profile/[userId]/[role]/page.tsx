import { ProfileHeader } from "@/app/user-dashboard/profile/[userId]/[role]/profile-header";
import { ProfileTabs } from "@/app/user-dashboard/profile/[userId]/[role]/profile-tabs";
import { ProfileHeaderSkeleton } from "@/app/user-dashboard/profile/[userId]/[role]/skeletons/profile-header-skeleton";
import { ProfileInfoBoxesSkeleton } from "@/app/user-dashboard/profile/[userId]/[role]/skeletons/profile-info-boxes-skeleton";
import { ProfileTabsSkeleton } from "@/app/user-dashboard/profile/[userId]/[role]/skeletons/profile-tabs-skeleton";
import { Test } from "@/app/user-dashboard/profile/[userId]/[role]/test-suspense";
import { type UserRole } from "@prisma/client";
import { Suspense } from "react";

interface UserProfilePageProps {
	params: Promise<{
		userId: string;
		role: UserRole | "LATEST";
	}>;
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
					<Test {...extractedParams} />
				</Suspense>
				<Suspense fallback={<ProfileTabsSkeleton userId={extractedParams.userId} />}>
					<ProfileTabs {...extractedParams} />
				</Suspense>
			</div>
		</>
	);
}
