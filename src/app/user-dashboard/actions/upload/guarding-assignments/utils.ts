import { USE_DEFAULT_SCORE } from "@/app/_utils/constants";
import { type ParsedAssignment, type ParsedDutiesAssignments, type UploadableDutiesAndAssignments } from "@/app/user-dashboard/actions/upload/guarding-assignments/types";
import { createId } from "@paralleldrive/cuid2";
import { type Assignment, type Duty, DutyKind, type Organization, type User, type UserRole } from "@prisma/client";
import { addDays, parseISO, setHours } from "date-fns";

function isNumeric(str: string) {
	return !isNaN(Number(str)) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
		!isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
}

interface SharedParams {
	dutiesAssignments: ParsedDutiesAssignments;
	allUsersIdsByFullName: Record<string, User["id"]>;
}

const START_DATE_AND_DURATION_SEPARATOR = "_";

export function parseAssignmentInfoStr({
	infoStr,
	dutiesAssignments,
	allUsersIdsByFullName,
}: SharedParams & {
	infoStr: string;
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
	
	if (durationInDaysStr !== "1" && durationInDaysStr !== "2" && durationInDaysStr !== "3") {
		throw new Error(`${mark} - the duration in days (${durationInDaysStr}) must be 1, 2 or 3`);
	}
	
	const durationInDays = Number(durationInDaysStr);
	
	if (durationInDays !== 1 && durationInDays !== 2 && durationInDays !== 3) {
		throw new Error(`${mark} - Invalid duration in days (${durationInDaysStr}) - it must be 1, 2 or 3`);
	}
	
	if (!allUsersIdsByFullName[assigneeFullName]) {
		throw new Error(`${mark} - there's no user with the given name`);
	}
	
	const key = startDateStr + START_DATE_AND_DURATION_SEPARATOR + durationInDays;
	
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

export function convertParsedDataToUploadableData({
	dutiesAssignments,
	allUsersIdsByFullName,
	organizationId,
	userRole,
}: SharedParams & {
	organizationId: Organization["id"];
	userRole: UserRole;
}): UploadableDutiesAndAssignments {
	const uploadableData: UploadableDutiesAndAssignments = {
		duties: [],
		assignments: [],
	};
	
	Object.entries(dutiesAssignments).forEach(([ startDateAndDuration, assignments ]) => {
		const [ startDateStr, durationStr ] = startDateAndDuration.split(START_DATE_AND_DURATION_SEPARATOR);
		
		// The start date and duraton strings must be defined due to the way the
		// duties assignment object is built
		const startDate = setHours(parseISO(startDateStr!), 10);
		
		// When building the duties assignments object, the duration is checked to be "1", "2" or "3"!
		const duration = Number(durationStr);
		
		const endDate = addDays(startDate, duration);
		
		const dutyDetails: Duty = {
			id: createId(),
			kind: DutyKind.GUARDING,
			organizationId,
			startDate,
			endDate,
			quantity: assignments.length,
			role: userRole,
			score: USE_DEFAULT_SCORE,
			isPrivate: false,
			description: null,
		};
		
		uploadableData.duties.push(dutyDetails);
		
		const assignmentsData = assignments.map<Assignment>(({
			assigneeFullName,
			reserveFullName,
			extraScore,
			note,
		}) => ({
			id: createId(),
			dutyId: dutyDetails.id,
			// It must be defined because when parsing the data, there's validation if the user exists
			assigneeId: allUsersIdsByFullName[assigneeFullName]!,
			// It must be defined, same reason as above
			reserveId: reserveFullName
				? allUsersIdsByFullName[reserveFullName]!
				: null,
			extraScore: extraScore ?? null,
		}));
		
		uploadableData.assignments.push(...assignmentsData);
	});
	
	return uploadableData;
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
