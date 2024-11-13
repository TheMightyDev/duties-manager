import { DutyAssignments } from "@/app/user-dashboard/profile/[userId]/[role]/components/duty-assignments";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { type UserRole } from "@prisma/client";

interface ProfileTabsProps {
	userId: string;
	role: UserRole | "LATEST";
}

export async function ProfileTabs({ userId, role }: ProfileTabsProps) {
	const session = await auth();
	const isLoggedUserOrAdmin = session?.user.id === userId || session?.user.isAdmin;
	
	const [ assignments, periods ] = await (
		isLoggedUserOrAdmin
			? Promise.all([
				api.user.getUserAssignments({
					userId,
					role: role !== "LATEST" ? role : undefined,
				}),
				api.user.getUserPeriodsById(userId),
			])
			: Promise.all([
				api.user.getUserAssignments({
					userId,
					role: role !== "LATEST" ? role : undefined,
				}),
				null,
			])
	) ;
	
	return (
		<>
			<DutyAssignments assignments={assignments!}/>
			<pre dir="ltr">
				{ JSON.stringify(periods, null, 2)}
			</pre>
		</>
	);
};
