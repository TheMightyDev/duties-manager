import { AdminActions } from "@/app/user-dashboard/upload/(overview)/admin-actions";
import { auth } from "@/server/auth";

export default async function UploadPage() {
	const session = await auth();
	
	return (
		<div>
			<p>בקרוב תוכלו להגיש כאן הסתייגויות!</p>
			{
				session?.user.isAdmin &&
				<AdminActions />
			}
		</div>
	);
};
