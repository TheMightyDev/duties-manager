import { ProfileInfoBoxes } from "@/app/user-dashboard/profile/[userId]/[role]/components/profile-info-boxes";
import { ProfileRoleSelector } from "@/app/user-dashboard/profile/[userId]/[role]/components/profile-role-selector";
import { type UserProfileProps } from "@/app/user-dashboard/profile/[userId]/[role]/types";

export function UserProfile(props: UserProfileProps) {
	return (
		<div className="flex flex-col">
			<h2
				className="sticky top-0 flex h-12 flex-row gap-2 bg-white/50 p-1 text-xl backdrop-blur-md"
				dir="rtl"
			>
				<span className="text-3xl font-bold">
					{props.userJustice.userFullName}
				</span>
				<ProfileRoleSelector
					roleRecords={props.roleRecords}
					selectedRole={props.roleRecords.at(-1)!.role === props.userJustice.role ? "LATEST" : props.userJustice.role}
				/>
			</h2>
			
			<div>
				<div className="flex flex-col gap-2">
					<ProfileInfoBoxes {...props} />
					<button className="rounded-full bg-purple-400">עריכת פרטים אישיים</button>
				</div>
				
			</div>
		</div>
	);
};
