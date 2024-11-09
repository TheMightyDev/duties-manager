import { ProfileInfoBoxes } from "@/app/user-dashboard/profile/[userId]/[role]/ProfileInfoBoxes";
import { type UserProfileProps } from "@/app/user-dashboard/profile/[userId]/[role]/types";

export function UserProfile(props: UserProfileProps) {
	return (
		<>
			<h2>{props.userJustice.userFullName}</h2>
			<div className="flex flex-col gap-2 lg:flex-row">
				<ProfileInfoBoxes {...props} />
				<div className="w-full bg-red-300">
					<pre dir="ltr">
						{
							JSON.stringify(props.assignments, null, 2)
						}
					</pre>
				</div>
			</div>
		</>
	);
};
