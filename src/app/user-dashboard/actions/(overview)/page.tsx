import { AdminActions } from "@/app/user-dashboard/actions/(overview)/admin-actions";
import { auth } from "@/server/auth";

export default async function ActionsPage() {
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
