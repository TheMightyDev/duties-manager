import { type ParsedAssignment } from "@/app/user-dashboard/actions/upload/users/types";
import { type User } from "@prisma/client";

export function parseAssignmentInfoStr({
	infoStr,
	allUsersIdsByFullName,
}: {
	infoStr: string;
	allUsersIdsByFullName: Record<string, User["id"]>;
}): ParsedAssignment {
	const splitData = infoStr.split("\t");
	
	const [
		startDateStr,
		durationInDaysStr,
		assigneeFullName,
		/** Optional
		 * - If it's a string - it's a reserve full name
		 * - If it's a number - it's extra score */
		reserveFullNameOrExtraScore,
		/** Optional
		 * - If it's a string - it's note
		 * - If it's a number - it's extra score
		*/
		extraScoreOrNote,
		/** Optional */
		note,
	] = splitData;
	
	const mark = `"${startDateStr} ${assigneeFullName}"`;
	
	// All these fields are required
	if (
		!startDateStr ||
		!durationInDaysStr ||
		!assigneeFullName
	) {
		throw new Error(`${mark} - One of the required fields is empty or missing - ${splitData.length} properties out of 3`);
	}
	
	const durationInDays = Number(durationInDaysStr);
	
	if (durationInDays !== 1 && durationInDays !== 2 && durationInDays !== 3) {
		throw new Error(`${mark} - Invalid duration in days (${durationInDaysStr}) - it must be 1, 2 or 3`);
	}
	
	if (!allUsersIdsByFullName[assigneeFullName]) {
		throw new Error(`${mark} - there's no user with the given name`);
	}
	
	return {
		startDateStr,
		durationInDays,
		assigneeFullName,
		assigneeId: allUsersIdsByFullName[assigneeFullName],
	};
}
