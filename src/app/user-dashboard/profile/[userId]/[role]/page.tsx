import { ProfileInfoBoxesSkeleton } from "@/app/user-dashboard/profile/[userId]/[role]/skeletons/profile-info-boxes-skeleton";
import { ProfileTabs } from "@/app/user-dashboard/profile/[userId]/[role]/skeletons/profile-tabs";
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
			<Suspense fallback={<ProfileInfoBoxesSkeleton />}>
				<Test {...extractedParams} />
			</Suspense>
			<Suspense fallback={<p>no data yet</p>}>
				<ProfileTabs {...extractedParams} />
			</Suspense>
		</>
	);
}
