import { calcUserPosition } from "@/app/_utils/justice/calc-user-position";
import { UserProfile } from "@/app/user-dashboard/profile/[userId]/[role]/components/user-profile";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { UTCDate } from "@date-fns/utc";
import { type UserRole } from "@prisma/client";
import { endOfDay } from "date-fns";

interface TestProps {
	params: Promise<{
		userId: string;
		role: UserRole | "LATEST";
	}>;
}
export async function Test({ params }: TestProps) {
	const {
		userId,
		role,
	} = await params;
	const session = await auth();
	const isLoggedUser = session?.user.id === userId;
	const roleRecords = await api.user.getAllUserRolesById(userId);
	
	if (!roleRecords) {
		return "No user with the given ID was found";
	}
	
	const selectedRecord = role === "LATEST" ? roleRecords.at(-1) : roleRecords.find((curr) => curr.role === role);

	if (!selectedRecord) {
		return "The user never fulfilled the given role so far or the role is unknown";
	}
	
	const usersJusticeInSameRole = await api.user.getManyUsersJustice({
		roles: [ selectedRecord.role ],
		/** The `latestFulfilledDate` is `null` if the user currently assigned to the role */
		definitiveDate: selectedRecord.latestFulfilledDate ?? endOfDay(new UTCDate()),
		includeExemptAndAbsentUsers: true,
	});
	
	console.log("@@@@@@@@@@@@ selectedRecord.role", selectedRecord.role);
	
	const assignments = await api.user.getUserAssignments({
		userId,
		role: selectedRecord.role,
	});
	
	const userPosition = calcUserPosition({
		usersJustice: usersJusticeInSameRole,
		userId,
	});
	
	const userJustice = usersJusticeInSameRole.find((curr) => curr.userId === userId);
	
	return (
		<>
			<UserProfile
				userJustice={userJustice!}
				assignments={assignments!}
				totalRelevantUsersCount={usersJusticeInSameRole.length}
				userPosition={userPosition}
				roleRecords={roleRecords}
			/>
			{
				isLoggedUser && <p>success</p>
			}
		</>
	);
};
