import { Accordion } from "@/app/_components/accordion/accordion";
import { Tabs } from "@/app/_components/tabs/tabs";
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
			<div className="m-auto flex max-w-96 flex-col gap-2 sm:max-w-none sm:flex-row">
				<ProfileInfoBoxes {...props} />
				<div className="block w-full p-2 sm:hidden">
					<Accordion
						title="היי"
						isOpenByDefault={false}
					>
						<DutyAssignments {...props} />
					</Accordion>
				</div>
				<div className="hidden w-full sm:block">
					<Tabs tabs={[
						{
							title: "תורנויות",
							contents: <DutyAssignments {...props} />,
						},
						{
							title: "תפקידים",
							contents: <p>yooo22</p>,
						},
						{
							title: "פטורים",
							contents: <p>yooo33</p>,
						},
					]}
					/>
				</div>
			</div>
		</>
	);
};
