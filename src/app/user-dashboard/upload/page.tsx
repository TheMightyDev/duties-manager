import { type ParsedUserAndPeriods, type ParseUsersInfoStrReturn } from "@/app/user-dashboard/upload/types";
import { UploadContents } from "@/app/user-dashboard/upload/upload-contents";
import { parseUserInfoStr } from "@/app/user-dashboard/upload/utils";
import { auth } from "@/server/auth";
import { createId } from "@paralleldrive/cuid2";
import { type Period, type User } from "@prisma/client";

let cachedValidParsedInfo: ParsedUserAndPeriods[] = [];

export default async function UploadPage() {
	async function validateUsersInfo(usersInfoStr: string): Promise<ParseUsersInfoStrReturn> {
		"use server";
		
		const isOnlyWhitespaceStr = (str: string) => !/\S/.test(str);
		const usersInfoStrs = usersInfoStr
			.split(/\r?\n/g)
			.filter((line) => !isOnlyWhitespaceStr(line));
		
		const errorMessages: string[] = [];
			
		const parsedInfo = usersInfoStrs.map((infoStr, i) => {
			try {
				const parsedInfo = parseUserInfoStr(infoStr);
				
				return parsedInfo;
			} catch (err) {
				errorMessages.push(`#Line ${String(i + 1)} - ${(err as Error).message}`);
			}
		});
		
		if (errorMessages.length === 0) {
			cachedValidParsedInfo = parsedInfo.filter((info) => info !== undefined);
		}
		
		return {
			errorMessages,
			parsedInfoJson: JSON.stringify(parsedInfo, null, 2),
		};
	}
	
	async function uploadCachedValidParsedInfo(): Promise<string> {
		"use server";
		
		// The APIs for periods and user were designed to expect
		// exact data to be inserted and simply insert it.
		
		console.log(cachedValidParsedInfo);
		
		const organizationId = (await auth())?.user.organizationId;
		if (!organizationId) {
			throw new Error("No organization ID was found...");
		}
		const insertedUsers: User[] = [];
		const insertedPeriods: Period[] = [];
		
		cachedValidParsedInfo.forEach((data) => {
			const userId = createId();
			
			insertedUsers.push({
				// The data provided is incomplete
				...data.user,
				id: userId,
				organizationId,
				isAdmin: false,
				registerDate: null,
			});
			
			data.periods.forEach((period) => {
				insertedPeriods.push({
					// The data provided is incomplete
					...period,
					id: createId(),
					userId,
				});
			});
		});
		
		console.log(insertedUsers);
		console.log("-------------------------------");
		
		console.log(insertedPeriods);
		
		return "Upload not initiated";
	}
	
	return (
		<>
			<UploadContents
				validateUsersInfo={validateUsersInfo}
				uploadCachedValidParsedInfo={uploadCachedValidParsedInfo}
			/>
		</>
	);
};
