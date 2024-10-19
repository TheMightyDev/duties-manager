import { JusticeOverview } from "@/app/user-dashboard/justice/justice-overview";
import { type FetchUsersJusticeParams } from "@/app/user-dashboard/justice/types";
import { api } from "@/trpc/server";

export default async function JusticePage() {
	async function fetchUsersJustice({
		roles,
		definitiveDate,
	}: FetchUsersJusticeParams) {
		"use server";
		
		return await api.justice.getUsersJustice({
			roles,
			definitiveDate,
		});
	};
	
	return (
		<>
			<JusticeOverview fetchUsersJustice={fetchUsersJustice} />
		</>
	);
};
