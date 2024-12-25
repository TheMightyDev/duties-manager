import { AdminActions } from "@/app/user-dashboard/actions/(overview)/admin-actions";
import { auth } from "@/server/auth";

export default async function ActionsPage() {
	const session = await auth();
	
	return (
		<div>
			<p>בקרוב תוכלו להגיש כאן הסתייגויות!</p>
			<p>
				בקרוב יהיה כאן קישור לדף עם שאלות ותשובות עם אקורדיונים
			</p>
			<p>
				בקרוב יהיה כאן קרדיט לספריות וAPIs שנעשה בהן שימוש
			</p>
			{
				session?.user.isAdmin &&
				<AdminActions />
			}
		</div>
	);
};
