import { splitToLinesAndFilterEmpty } from "@/app/_utils/string-utils";
import { type AssignmentsUploadCounts, type ParsedDutiesAssignments, type ValidateUploadedInfoParams } from "@/app/user-dashboard/actions/upload/guarding-assignments/types";
import { UploadGuardingAssignmentsContents } from "@/app/user-dashboard/actions/upload/guarding-assignments/upload-guarding-assignments-contents";
import { convertParsedDataToUploadableData, parseAssignmentInfoStr } from "@/app/user-dashboard/actions/upload/guarding-assignments/utils";
import { type InitialParseResults } from "@/app/user-dashboard/actions/upload/types";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { api } from "@/trpc/server";
import { type UserRole } from "@prisma/client";

let cachedValidParsedInfo: ParsedDutiesAssignments | null = null;
let cachedUserRole: UserRole | null = null;

export default async function UploadGuardingAssignmentsPage() {
	const allUsersIdsByFullName = await api.user.getAllUsersFullNameAndId();
	
	async function validateUploadedInfo({
		infoStr,
		userRole,
	}: ValidateUploadedInfoParams): Promise<InitialParseResults> {
		"use server";
		
		const splitInfoStrs = splitToLinesAndFilterEmpty(infoStr);
		
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
		
		cachedValidParsedInfo = dutiesAssignments;
		cachedUserRole = userRole;
		
		return {
			errorMessages,
			parsedInfoJson: JSON.stringify(dutiesAssignments, null, 2),
		};
	}
	
	async function uploadCachedValidParsedInfo(): Promise<AssignmentsUploadCounts> {
		"use server";
		
		if (!cachedValidParsedInfo || !cachedUserRole) {
			console.error("You cannot call this function if there's no cached valid parsed info");

			return {
				assignments: 0,
				duties: 0,
			};
		}
		
		console.log("@cachedParsedDutiesAssignments", cachedValidParsedInfo);
		
		// There must be a logged user to view the page
		const organizationId = (await auth())!.user.organizationId;
		
		const uploadableData = convertParsedDataToUploadableData({
			allUsersIdsByFullName,
			dutiesAssignments: cachedValidParsedInfo,
			organizationId,
			userRole: cachedUserRole,
		});
		
		console.log(uploadableData);
		
		const uploadCountResults: AssignmentsUploadCounts = {
			duties:	(await db.duty.createMany({
				data: uploadableData.duties,
			})).count,
			assignments:	(await db.assignment.createMany({
				data: uploadableData.assignments,
			})).count,
		};
		
		return uploadCountResults;
	}
	
	return (
		<>
			<UploadGuardingAssignmentsContents
				validateUploadedInfo={validateUploadedInfo}
				uploadCachedValidParsedInfo={uploadCachedValidParsedInfo}
			/>
		</>
	);
};
