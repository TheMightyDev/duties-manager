import { Accordion } from "@/app/_components/accordion/accordion";
import { Tabs } from "@/app/_components/tabs/tabs";
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
			<div className="block w-full p-2 sm:hidden">
				<Accordion
					title="היי"
					isOpenByDefault={false}
				>
					<DutyAssignments assignments={assignments!} />
					<DutyAssignments assignments={assignments!} />
					<DutyAssignments assignments={assignments!} />
					<DutyAssignments assignments={assignments!} />
				</Accordion>
			</div>
			<div className="mt-12 hidden max-h-80 w-full sm:block">
				<Tabs
					className="h-full max-h-80 overflow-y-scroll bg-slate-300"
					tabs={[
						{
							title: "תורנויות",
							contents: <>
								<DutyAssignments assignments={assignments!} />
							</>,
						},
						{
							title: "תפקידים",
							isVisible: isLoggedUserOrAdmin,
							contents: <pre dir="ltr">
								{ JSON.stringify(periods, null, 2)}
							</pre>,
						},
						{
							title: "פטורים",
							isVisible: isLoggedUserOrAdmin,
							contents: <p>yooo33</p>,
						},
					]}
				/>
			</div>
		</>
	);
};
2;
