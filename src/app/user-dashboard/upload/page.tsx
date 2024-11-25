import { type ParsedUserAndPeriods, type ParseUsersInfoStrReturn } from "@/app/user-dashboard/upload/types";
import { UploadContents } from "@/app/user-dashboard/upload/upload-contents";
import { parseUserInfoStr } from "@/app/user-dashboard/upload/utils";

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
		
		console.log(cachedValidParsedInfo);
		
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
