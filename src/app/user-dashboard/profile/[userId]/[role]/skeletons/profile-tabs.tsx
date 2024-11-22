import { Accordion } from "@/app/_components/tabs-and-accordions/accordion";
import { Tabs } from "@/app/_components/tabs-and-accordions/tabs";
import { DutyAssignments } from "@/app/user-dashboard/profile/[userId]/[role]/components/duty-assignments";
import { PeriodsContainer } from "@/app/user-dashboard/profile/[userId]/[role]/profile-data-components/periods-container";
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
					title="תורנויות"
					isOpenByDefault={false}
				>
					<DutyAssignments assignments={assignments!} />
					<DutyAssignments assignments={assignments!} />
					<DutyAssignments assignments={assignments!} />
					<DutyAssignments assignments={assignments!} />
				</Accordion>
				<Accordion
					title="תפקידים"
					isOpenByDefault={false}
				>
					<PeriodsContainer periods={periods!} />
				</Accordion>
				
			</div>
			<div className="mt-12 hidden max-h-[70vh] w-full sm:block">
				<Tabs
					className="h-full  overflow-y-scroll bg-slate-300"
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
							contents: <PeriodsContainer periods={periods!} />,
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

