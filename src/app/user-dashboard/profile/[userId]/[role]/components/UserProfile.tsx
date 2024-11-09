import { DutyAssignments } from "@/app/user-dashboard/profile/[userId]/[role]/components/duty-assignments";
import { ProfileInfoBoxes } from "@/app/user-dashboard/profile/[userId]/[role]/components/ProfileInfoBoxes";
import { type UserProfileProps } from "@/app/user-dashboard/profile/[userId]/[role]/types";

export function UserProfile(props: UserProfileProps) {
	return (
		<>
			<h2 className="text-3xl font-bold">{props.userJustice.userFullName}</h2>
			<div className="flex flex-col gap-2 lg:flex-row">
				<ProfileInfoBoxes {...props} />
				<DutyAssignments {...props} />
			</div>
		</>
	);
};
