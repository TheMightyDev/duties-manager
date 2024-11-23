import { JusticeOverview } from "@/app/user-dashboard/justice/justice-overview";
import { type FetchUsersJusticeParams } from "@/app/user-dashboard/justice/types";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";

export default async function JusticePage() {
	const session = await auth();
	
	const loggedUserId = session?.user.id;
	
	if (!loggedUserId) {
		return <>Not logged in</>;
	}
	
	const roleRecords = await api.user.getAllUserRolesById(loggedUserId);
	
	async function fetchUsersJustice(params: FetchUsersJusticeParams) {
		"use server";
		
		return await api.user.getManyUsersJustice(params);
	};
	
	return (
		<>
			<JusticeOverview
				fetchUsersJustice={fetchUsersJustice}
				loggedUserLatestRole={roleRecords?.at(-1)?.role}
			/>
		</>
	);
};
