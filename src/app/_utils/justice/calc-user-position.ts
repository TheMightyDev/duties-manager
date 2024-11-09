import { sortUsersJustice } from "@/app/_utils/justice/sort-users-justice";
import { type UserJustice } from "@/types/justice/user-justice";

/** Receives an array of users justice that are true for some definitive date, and a user ID.
 *
 * **Note:** The array may or not be sorted descending by weighted score - it gets sorted in the function.
 *
 * Returns the position (index + 1) of the user in sorted users justice.
 *
 * If there are multiple users with the same weighted score, returns the position of the first found user that has the same score as the given user ID. E.g.:
 *
 * If the ID is Dor's ID and the sorted users justice is:
 *
 * - Alon	2.45
 * - Max	2.20
 * - Dana	2.10
 * - Dor  2.10
 * - John 1.95
 *
 * Because Dana and Dor have the same weighted score, the position of Dana's would be returned (`3`).
 *
 * Returns `-1` if there's no user with the given ID.
 */
export function calcUserPosition({ usersJustice, userId }: {
	usersJustice: UserJustice[];
	userId: string;
}): number {
	const selectedUserWeightedScore = usersJustice.find((curr) => curr.userId === userId)?.weightedScore;
	
	if (selectedUserWeightedScore === undefined) {
		return -1;
	}
	
	const usersJusticeSorted = sortUsersJustice({
		usersJustice,
		colIdToSortBy: "weightedScore",
		ascending: false,
	});
	
	// We find the position of the first user with the found weighted score
	// So the position of the given user would not be affected by its position in the array
	// (e.g. if it would appear later, they'd have a smaller position)
	// We add `1` because we want position and not index
	const userPosition = usersJusticeSorted.findIndex((curr) => curr.weightedScore === selectedUserWeightedScore) + 1;
	
	return userPosition;
}
