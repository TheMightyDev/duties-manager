import { type UserWithAssignments } from "@/server/api/types/user-with-assignments";
import { type UserJustice } from "@/types/justice/user-justice";

export interface UserProfileProps {
	userJustice: UserJustice;
	/** Is the profile page set to show an old role,
	 * that the user no longer fulfills
	 */
	isEarlyRole: boolean;
	userPosition: number;
	totalRelevantUsersCount: number;
	assignments: UserWithAssignments["assignments"];
}
