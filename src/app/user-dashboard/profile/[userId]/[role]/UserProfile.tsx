import { ProfileInfoBoxes } from "@/app/user-dashboard/profile/[userId]/[role]/ProfileInfoBoxes";
import { type UserProfileProps } from "@/app/user-dashboard/profile/[userId]/[role]/types";

export function UserProfile(props: UserProfileProps) {
	return (
		<>
			<h2>{props.userJustice.userFullName}</h2>
			<ProfileInfoBoxes {...props} />
		</>
	);
};
