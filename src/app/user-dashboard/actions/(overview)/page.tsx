import { AdminActions } from "@/app/user-dashboard/actions/(overview)/admin-actions";
import { UserActions } from "@/app/user-dashboard/actions/(overview)/user-actions";
import { auth } from "@/server/auth";

export default async function ActionsPage() {
	const session = await auth();
	
	return (
		<div>
			<UserActions/>
			{ session?.user.isAdmin && <AdminActions /> }
		</div>
	);
};
