import { calcUserPosition } from "@/app/_utils/justice/calc-user-position";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { type UserRole } from "@prisma/client";

interface UserProfilePageProps {
	params: Promise<{
		userId: string;
		role: UserRole | "LATEST";
	}>;
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
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
		definitiveDate: selectedRecord.latestFulfilledDate,
		includeExemptAndAbsentUsers: true,
	});
	
	const userPosition = calcUserPosition({
		usersJustice: usersJusticeInSameRole,
		userId,
	});
	
	return (
		<>
			<pre dir="ltr">
				{JSON.stringify(roleRecords, null, 2)}
			</pre>
			<p>
				{userPosition}/{usersJusticeInSameRole.length}
			</p>
			<pre dir="ltr">{JSON.stringify(usersJusticeInSameRole, null, 2)}</pre>
			{
				isLoggedUser && <p>success</p>
			}
		</>
	);
}
