import { type ParseUsersInfoStrReturn } from "@/app/user-dashboard/upload/types";
import { UploadContents } from "@/app/user-dashboard/upload/upload-contents";
import { parseUserInfoStr } from "@/app/user-dashboard/upload/utils";

export default async function UploadPage() {
	async function validateUsersInfo(usersInfoStr: string): Promise<ParseUsersInfoStrReturn> {
		"use server";
		
		const usersInfoStrs = usersInfoStr
			.split(/\r?\n/g);
		
		const errorMessages: string[] = [];
			
		const parsedInfo = usersInfoStrs.map((infoStr, i) => {
			try {
				const parsedInfo = parseUserInfoStr(infoStr);
				
				return parsedInfo;
			} catch (err) {
				errorMessages.push(`#Line ${String(i + 1)} - ${(err as Error).message}`);
			}
		});
		
		return {
			errorMessages,
			parsedInfo,
		};
	}
	
	return (
		<>
			<UploadContents validateUsersInfo={validateUsersInfo}/>
		</>
	);
};
