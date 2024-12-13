import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs";
import { DutyAssignments } from "@/app/user-dashboard/profile/[userId]/[role]/components/duty-assignments";
import { PeriodsContainer } from "@/app/user-dashboard/profile/[userId]/[role]/components/periods-container";
import { type ProfilePageUrlParams } from "@/app/user-dashboard/profile/[userId]/[role]/types";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { type Period } from "@prisma/client";
import clsx from "clsx";
import { Suspense } from "react";

export async function ProfileTabs({ userId, role }: ProfilePageUrlParams) {
	const session = await auth();
	
	if (!session) {
		return <></>;
	}
	
	const isLoggedUserOrAdmin = session.user.id === userId || session.user.isAdmin;
	
	const isLoggedUserAdmin = Boolean(session.user.isAdmin);
	
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
	);
	
	async function replacePeriodsWith(nextPeriods: Period[]) {
		"use server";
		
		await api.user.replacePeriods({
			userId,
			nextPeriods,
		});
	}

	return (
		<>
			<Tabs
				defaultValue="assignments"
				className="max-w-[600px] grow"
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
						<Suspense fallback="w">
							<PeriodsContainer
								periods={periods}
								isLoggedUserAdmin={isLoggedUserAdmin}
								replacePeriodsWith={replacePeriodsWith}
							/>
						</Suspense>
					</TabsContent>
				}
			</Tabs>
		</>
	);
};

