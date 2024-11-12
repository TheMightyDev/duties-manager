import { ProfileInfoBoxesSkeleton } from "@/app/user-dashboard/profile/[userId]/[role]/skeletons/profile-info-boxes-skeleton";
import { Test } from "@/app/user-dashboard/profile/[userId]/[role]/Test";
import { type UserRole } from "@prisma/client";
import { Suspense } from "react";

interface UserProfilePageProps {
	params: Promise<{
		userId: string;
		role: UserRole | "LATEST";
	}>;
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
	return (
		<>
			<Suspense fallback={<ProfileInfoBoxesSkeleton />}>
				<Test params={params}/>
			</Suspense>
		</>
	);
}
