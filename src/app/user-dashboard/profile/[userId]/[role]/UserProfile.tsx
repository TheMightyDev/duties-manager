"use client";

import { ProfileInfoBoxes } from "@/app/user-dashboard/profile/[userId]/[role]/ProfileInfoBoxes";
import { type UserWithAssignments } from "@/server/api/types/user-with-assignments";
import { type UserJustice } from "@/types/justice/user-justice";

interface UserProfileProps {
	userJustice: UserJustice;
	userPosition: number;
	totalRelevantUsersCount: number;
	assignments: UserWithAssignments["assignments"];
}

export function UserProfile(props: UserProfileProps) {
	return (
		<>
			<h2>{props.userJustice.userFullName}</h2>
			<ProfileInfoBoxes {...props} />
		</>
	);
};
