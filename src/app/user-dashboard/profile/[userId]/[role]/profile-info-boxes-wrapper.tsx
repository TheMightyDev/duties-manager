import { calcUserPosition } from "@/app/_utils/justice/calc-user-position";
import { ProfileInfoBoxes } from "@/app/user-dashboard/profile/[userId]/[role]/components/profile-info-boxes";
import { type ProfilePageUrlParams } from "@/app/user-dashboard/profile/[userId]/[role]/types";
import { api } from "@/trpc/server";
import { UTCDate } from "@date-fns/utc";
import { endOfDay, subDays } from "date-fns";

export async function ProfileInfoBoxesWrapper({ userId, role }: ProfilePageUrlParams) {
	const roleRecords = await api.user.getAllUserRolesById(userId);
	
	if (!roleRecords) {
		return "No user with the given ID was found";
	}
	
	const selectedRecord = roleRecords.find((curr) => curr.role === role);

	if (!selectedRecord) {
		return "The user never fulfilled the given role so far or the role is unknown";
	}
	
	const usersJusticeInSameRole = await api.user.getManyUsersJustice({
		roles: [ selectedRecord.role ],
		/** The `latestFulfilledDate` is `null` if the user currently assigned to the role */
		definitiveDate: selectedRecord.latestFulfilledDate !== null
			// The end date of periods is **exclusive**, so if we don't subtract any
			// day from the latest fulfilled date, we won't get any periods, and that'd result in fatal errors
			? subDays(selectedRecord.latestFulfilledDate, 1)
			: endOfDay(new UTCDate()),
		includeExemptAndAbsentUsers: true,
	});
	
	console.log("@@@@@@@@@@@@ selectedRecord.role", selectedRecord.role);
	
	const userPosition = calcUserPosition({
		usersJustice: usersJusticeInSameRole,
		userId,
	});
	
	const userJustice = usersJusticeInSameRole.find((curr) => curr.userId === userId);
	
	return (
		<ProfileInfoBoxes
			userJustice={userJustice!}
			totalRelevantUsersCount={usersJusticeInSameRole.length}
			userPosition={userPosition}
			roleRecords={roleRecords}
		/>
	);
};
