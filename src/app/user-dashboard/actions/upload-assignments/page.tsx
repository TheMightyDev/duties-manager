import { api } from "@/trpc/server";

export default async function UploadUsersPage() {
	const allUsersIds = await api.user.getAllUsersFullNameAndId();
	
	return (
		<>
			<pre dir="ltr">
				{JSON.stringify(allUsersIds, null, 2)}
			</pre>
		</>
	);
};
