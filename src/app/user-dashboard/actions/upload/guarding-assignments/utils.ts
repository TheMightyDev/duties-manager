import { type ParsedAssignment, type ParsedDutiesAssignments } from "@/app/user-dashboard/actions/upload/guarding-assignments/types";
import { type User } from "@prisma/client";

function isNumeric(str: string) {
	return !isNaN(Number(str)) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
		!isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
}

export function parseAssignmentInfoStr({
	dutiesAssignments,
	infoStr,
	allUsersIdsByFullName,
}: {
	dutiesAssignments: ParsedDutiesAssignments;
	infoStr: string;
	allUsersIdsByFullName: Record<string, User["id"]>;
}) {
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
		optionalNote,
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
	
	const key = startDateStr + "_" + durationInDays;
	
	const parsedAssignment: ParsedAssignment = {
		assigneeFullName,
		...parseOptionalSegments({
			reserveFullNameOrExtraScore,
			extraScoreOrNote,
			optionalNote,
		}),
	};
	
	if (dutiesAssignments[key]) {
		dutiesAssignments[key].push(parsedAssignment);
	} else {
		dutiesAssignments[key] = [ parsedAssignment ];
	}
}

function parseOptionalSegments({ reserveFullNameOrExtraScore, extraScoreOrNote, optionalNote }: {
	reserveFullNameOrExtraScore?: string;
	extraScoreOrNote?: string;
	optionalNote?: string;
}): Omit<ParsedAssignment, "assigneeFullName"> {
	let reserveFullName: string | undefined = undefined;
	let extraScore: number | undefined = undefined;
	let note: string | undefined = undefined;
	
	if (reserveFullNameOrExtraScore) {
		// If the string can be parsed as a number
		if (isNumeric(reserveFullNameOrExtraScore)) {
			extraScore = Number(reserveFullNameOrExtraScore);
			
			if (extraScoreOrNote) {
				note = extraScoreOrNote;
			}
		} else {
			reserveFullName = reserveFullNameOrExtraScore;
			
			if (extraScoreOrNote) {
				if (isNumeric(extraScoreOrNote)) {
					extraScore = Number(extraScoreOrNote);
				
					if (optionalNote) {
						note = optionalNote;
					}
				} else {
					note = extraScoreOrNote;
				}
			}
		}
	}
	
	return {
		reserveFullName,
		note,
		extraScore,
	};
}
