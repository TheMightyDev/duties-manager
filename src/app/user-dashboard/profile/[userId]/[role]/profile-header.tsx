import { ProfileRoleSelector } from "@/app/user-dashboard/profile/[userId]/[role]/components/profile-role-selector";
import { type ProfilePageUrlParams } from "@/app/user-dashboard/profile/[userId]/[role]/types";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";

export async function ProfileHeader(props: ProfilePageUrlParams) {
	const session = await auth();
	
	let viewedUserFullName = props.userId === session?.user.id
		? session?.user.fullName
		: null;
		
	let viewedUserRoleRecords = props.userId === session?.user.id
		? session?.user.roleRecords
		: null;
		
	if (!viewedUserRoleRecords) {
		const [ fullName, roleRecords ] = await Promise.all([
			await api.user.getUserFullNameById(props.userId),
			await api.user.getAllUserRolesById(props.userId),
		]);
		
		viewedUserFullName = fullName;
		viewedUserRoleRecords = roleRecords;
	}
	
	if (!viewedUserRoleRecords) {
		return <></>;
	}
		
	return (
		<h2
			className="sticky top-0 z-10 flex h-12 flex-row flex-wrap justify-center gap-2 bg-white/50 p-1 text-xl backdrop-blur-md lg:justify-start"
			dir="rtl"
		>
			<span className="text-xl font-bold leading-10 sm:text-3xl">
				{viewedUserFullName}
			</span>
			<ProfileRoleSelector
				roleRecords={viewedUserRoleRecords}
				selectedRole={props.role}
			/>
		</h2>
	);
}
