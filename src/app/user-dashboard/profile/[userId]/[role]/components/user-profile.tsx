import { ProfileInfoBoxes } from "@/app/user-dashboard/profile/[userId]/[role]/components/profile-info-boxes";
import { type UserProfileProps } from "@/app/user-dashboard/profile/[userId]/[role]/types";

export function UserProfile(props: UserProfileProps) {
	return (
		<div className="flex flex-col">
			<div>
				<div className="flex flex-col gap-2 p-2 md:p-0">
					<ProfileInfoBoxes {...props} />
					<button className="rounded-full bg-purple-400">עריכת פרטים אישיים</button>
				</div>
			</div>
		</div>
	);
};
