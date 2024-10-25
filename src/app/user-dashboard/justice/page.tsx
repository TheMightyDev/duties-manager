import { JusticeOverview } from "@/app/user-dashboard/justice/justice-overview";
import { type FetchUsersJusticeParams } from "@/app/user-dashboard/justice/types";
import { api } from "@/trpc/server";

export default async function JusticePage() {
	async function fetchUsersJustice(params: FetchUsersJusticeParams) {
		"use server";
		
		return await api.user.getManyUsersJustice(params);
	};
	
	return (
		<>
			<JusticeOverview fetchUsersJustice={fetchUsersJustice} />
		</>
	);
};
