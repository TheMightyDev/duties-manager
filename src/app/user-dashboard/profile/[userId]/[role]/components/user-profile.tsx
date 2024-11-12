import { Accordion } from "@/app/_components/accordion/accordion";
import { Tabs } from "@/app/_components/tabs/tabs";
import { DutyAssignments } from "@/app/user-dashboard/profile/[userId]/[role]/components/duty-assignments";
import { ProfileInfoBoxes } from "@/app/user-dashboard/profile/[userId]/[role]/components/profile-info-boxes";
import { ProfileRoleSelector } from "@/app/user-dashboard/profile/[userId]/[role]/components/profile-role-selector";
import { type UserProfileProps } from "@/app/user-dashboard/profile/[userId]/[role]/types";

export function UserProfile(props: UserProfileProps) {
	return (
		<>
			<h2 className="sticky top-0 bg-white/50 p-1 text-xl backdrop-blur-md">
				<span className="text-3xl font-bold">
					{props.userJustice.userFullName}
				</span>
				<ProfileRoleSelector
					roleRecords={props.roleRecords}
					selectedRole={props.userJustice.role}
				/>
			</h2>
			
			<div className="m-auto flex  max-w-96 flex-col gap-2 sm:max-w-none sm:flex-row">
				<ProfileInfoBoxes {...props} />
				<div className="block w-full p-2 sm:hidden">
					<Accordion
						title="היי"
						isOpenByDefault={false}
					>
						<DutyAssignments {...props} />
					</Accordion>
				</div>
				<div className="hidden max-h-80 w-full sm:block">
					<Tabs
						className="h-full max-h-72 overflow-y-scroll bg-slate-300"
						tabs={[
							{
								title: "תורנויות",
								contents: <>
									<DutyAssignments {...props} />
									<DutyAssignments {...props} />
									<DutyAssignments {...props} />
								</>,
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
