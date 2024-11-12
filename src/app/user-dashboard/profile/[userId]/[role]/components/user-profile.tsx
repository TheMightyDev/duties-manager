import { Accordion } from "@/app/_components/accordion/accordion";
import { DutyAssignments } from "@/app/user-dashboard/profile/[userId]/[role]/components/duty-assignments";
import { ProfileInfoBoxes } from "@/app/user-dashboard/profile/[userId]/[role]/components/profile-info-boxes";
import { ProfileRoleSelector } from "@/app/user-dashboard/profile/[userId]/[role]/components/profile-role-selector";
import { type UserProfileProps } from "@/app/user-dashboard/profile/[userId]/[role]/types";

export function UserProfile(props: UserProfileProps) {
	return (
		<>
			<h2 className="text-3xl font-bold">{props.userJustice.userFullName}</h2>
			<ProfileRoleSelector
				roleRecords={props.roleRecords}
				selectedRole={props.userJustice.role}
			/>
			<div className="flex flex-col gap-2 lg:flex-row">
				<ProfileInfoBoxes {...props} />
				<div className="w-full p-2">
					<Accordion
						title="היי"
						isOpenByDefault={false}
					>
						<DutyAssignments {...props} />
					</Accordion>
				</div>
			</div>
		</>
	);
};
