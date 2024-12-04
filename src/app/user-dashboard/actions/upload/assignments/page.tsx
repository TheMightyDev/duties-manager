import { type AssignmentsUploadCounts, type ParsedDutiesAssignments } from "@/app/user-dashboard/actions/upload/assignments/types";
import { UploadAssignmentsContents } from "@/app/user-dashboard/actions/upload/assignments/upload-assignments-contents";
import { parseAssignmentInfoStr } from "@/app/user-dashboard/actions/upload/assignments/utils";
import { type InitialParseResults } from "@/app/user-dashboard/actions/upload/types";
import { api } from "@/trpc/server";

let cachedParsedDutiesAssignments: ParsedDutiesAssignments | undefined = undefined;

export default async function UploadAssignmentsPage() {
	const allUsersIdsByFullName = await api.user.getAllUsersFullNameAndId();
	
	async function validateUploadedInfo(infoStr: string): Promise<InitialParseResults> {
		"use server";
		
		const isOnlyWhitespaceStr = (str: string) => !/\S/.test(str);
		const splitInfoStrs = infoStr
			.split(/\r?\n/g)
			.filter((line) => !isOnlyWhitespaceStr(line));
		
		const dutiesAssignments: ParsedDutiesAssignments = {};
		
		const errorMessages: string[] = [];
		
		splitInfoStrs.forEach((infoStr, i) => {
			try {
				parseAssignmentInfoStr({
					dutiesAssignments,
					allUsersIdsByFullName,
					infoStr,
				});
			} catch (err) {
				errorMessages.push(`#Line ${String(i + 1)} - ${(err as Error).message}`);
			}
		});
		
		cachedParsedDutiesAssignments = dutiesAssignments;
		
		return {
			errorMessages,
			parsedInfoJson: JSON.stringify(dutiesAssignments, null, 2),
		};
	}
	
	async function uploadCachedValidParsedInfo(): Promise<AssignmentsUploadCounts> {
		"use server";
		
		console.log("@cachedParsedDutiesAssignments", cachedParsedDutiesAssignments);
		
		return {
			assignments: 0,
			duties: 0,
		};
	}
	
	return (
		<>
			<UploadAssignmentsContents
				validateUploadedInfo={validateUploadedInfo}
				uploadCachedValidParsedInfo={uploadCachedValidParsedInfo}
			/>
		</>
	);
};
