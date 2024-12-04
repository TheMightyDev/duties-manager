import { api } from "@/trpc/server";

export default async function UploadUsersPage() {
	const allUsersIds = await api.user.getAllUsersFullNameAndId();
	
	async function validateUploadedInfo(infoStr: string) {
		"use server";
		
		const isOnlyWhitespaceStr = (str: string) => !/\S/.test(str);
		const splitInfoStrs = infoStr
			.split(/\r?\n/g)
			.filter((line) => !isOnlyWhitespaceStr(line));
	}
	
	return (
		<>
			<pre dir="ltr">
				{JSON.stringify(allUsersIds, null, 2)}
			</pre>
		</>
	);
};
