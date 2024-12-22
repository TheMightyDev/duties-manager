import { splitToLinesAndFilterEmpty } from "@/app/_utils/string-utils";
import { type InitialParseResults } from "@/app/user-dashboard/actions/upload/types";
import { type ParsedUserAndPeriods, type UsersUploadCounts } from "@/app/user-dashboard/actions/upload/users/types";
import { UploadUsersContents } from "@/app/user-dashboard/actions/upload/users/upload-users-contents";
import { parseUserInfoStr } from "@/app/user-dashboard/actions/upload/users/utils";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { createId } from "@paralleldrive/cuid2";
import { type Period, type User } from "@prisma/client";

let cachedValidParsedInfo: ParsedUserAndPeriods[] = [];

export default async function UploadUsersPage() {
	async function validateUsersInfo(usersInfoStr: string): Promise<InitialParseResults> {
		"use server";
		
		const usersInfoStrs = splitToLinesAndFilterEmpty(usersInfoStr);
		
		const usersPhoneNumbers = await api.user.getAllUsersPhoneNumberAndFullName();
		
		const errorMessages: string[] = [];
			
		const parsedInfo = usersInfoStrs.map((infoStr, i) => {
			try {
				const parsedInfo = parseUserInfoStr(infoStr);
			
				const userPhoneNumber = usersPhoneNumbers[parsedInfo.user.phoneNumber.replaceAll("-", "")];
				if (userPhoneNumber) {
					throw new Error(`There's already a user with the same phone number - ${userPhoneNumber}`);
				}

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
	
	async function uploadCachedValidParsedInfo(): Promise<UsersUploadCounts> {
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
				adminNote: null,
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
		
		const uploadUsersResult = await api.upload.uploadUsers(insertedUsers);
		
		const uploadPeriodsResult = await api.upload.uploadPeriods(insertedPeriods);
		
		return {
			users: uploadUsersResult.count,
			periods: uploadPeriodsResult.count,
		};
	}
	
	return (
		<>
			<UploadUsersContents
				validateUsersInfo={validateUsersInfo}
				uploadCachedValidParsedInfo={uploadCachedValidParsedInfo}
			/>
		</>
	);
};
