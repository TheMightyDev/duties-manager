import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs";
import { DutyAssignments } from "@/app/user-dashboard/profile/[userId]/[role]/components/duty-assignments";
import { PeriodsContainer } from "@/app/user-dashboard/profile/[userId]/[role]/profile-data-components/periods-container";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { type UserRole } from "@prisma/client";
import clsx from "clsx";

interface ProfileTabsProps {
	userId: string;
	role: UserRole | "LATEST";
}

export async function ProfileTabs({ userId, role }: ProfileTabsProps) {
	const session = await auth();
	const isLoggedUserOrAdmin = session?.user.id === userId || session?.user.isAdmin;
	
	const isLoggedUserNotAdmin = !(session?.user.isAdmin);
	
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
			<Tabs
				defaultValue="account"
				className="max-w-[600px] grow  lg:mt-12"
			>
				<TabsList
					className={
						clsx(
							"grid w-full",
							periods ? "grid-cols-2" : "grid-cols-1"
						)
					}
					dir="rtl"
				>
					{
						assignments &&
						<TabsTrigger
							value="assignments"
							className="grow"
						>שיבוצים</TabsTrigger>
					}
					{
						periods &&
						<TabsTrigger value="periods">תפקידים</TabsTrigger>
					}
				</TabsList>
				{
					assignments &&
					<TabsContent
						value="assignments"
						dir="rtl"
					>
						<DutyAssignments assignments={assignments} />
					</TabsContent>
				}
				{
					periods &&
					<TabsContent
						value="periods"
						dir="rtl"
					>
						<PeriodsContainer
							periods={periods}
							isLoggedUserNotAdmin={isLoggedUserNotAdmin}
						/>
					</TabsContent>
				}
			</Tabs>
		</>
	);
};

