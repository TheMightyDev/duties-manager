import { ProfileRoleSelector } from "@/app/user-dashboard/profile/[userId]/[role]/components/profile-role-selector";
import { UserInfoEditorDialog } from "@/app/user-dashboard/profile/[userId]/[role]/components/user-info-editor-dialog/user-info-editor-dialog";
import { type formSchema, type ProfilePageUrlParams } from "@/app/user-dashboard/profile/[userId]/[role]/types";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { type User } from "@prisma/client";
import { type z } from "zod";

export async function ProfileHeader(props: ProfilePageUrlParams) {
	const session = await auth();
	
	let viewedUserBasicInfo: User | null = props.userId === session?.user.id
		? session?.user as User
		: null;
		
	let viewedUserRoleRecords = props.userId === session?.user.id
		? session?.user.roleRecords
		: null;
		
	if (!viewedUserRoleRecords) {
		const [ basicInfo, roleRecords ] = await Promise.all([
			await api.user.getUserBasicInfoById(props.userId),
			await api.user.getAllUserRolesById(props.userId),
		]);
		
		if (!basicInfo) {
			// TODO: Redirect to 404 error page
			return "No user with given ID";
		}
		
		viewedUserBasicInfo = basicInfo;
		viewedUserRoleRecords = roleRecords;
	}
	
	if (!viewedUserRoleRecords || !viewedUserBasicInfo) {
		return <></>;
	}
	
	async function updateUserInfo(updates: z.infer<typeof formSchema>) {
		"use server";
		
		await api.user.updateUserInfo(updates);
	}
		
	return (
		<h2
			className="sticky top-0 z-10 flex h-12 flex-row flex-wrap justify-center gap-2 bg-white/50 p-1 text-xl backdrop-blur-md lg:justify-start"
			dir="rtl"
		>
			<span className="text-xl font-bold leading-10 sm:text-3xl">
				{viewedUserBasicInfo.firstName + " " + viewedUserBasicInfo.lastName}
			</span>
			<ProfileRoleSelector
				roleRecords={viewedUserRoleRecords}
				selectedRole={props.role}
			/>
			<UserInfoEditorDialog
				user={viewedUserBasicInfo}
				updateUserInfo={updateUserInfo}
			/>
		</h2>
	);
}
