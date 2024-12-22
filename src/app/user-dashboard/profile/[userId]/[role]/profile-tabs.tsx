import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs";
import { getTextDirection } from "@/app/_utils/get-text-direction";
import { DutyAssignments } from "@/app/user-dashboard/profile/[userId]/[role]/components/duty-assignments";
import { PeriodsContainer } from "@/app/user-dashboard/profile/[userId]/[role]/components/periods-container";
import { type ProfilePageUrlParams } from "@/app/user-dashboard/profile/[userId]/[role]/types";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { type Period } from "@prisma/client";
import clsx from "clsx";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";

export async function ProfileTabs({ userId, role }: ProfilePageUrlParams) {
	const session = await auth();
	
	if (!session) {
		return <></>;
	}
	
	const locale = await getLocale();
	const textDir = getTextDirection(locale);
	const t = await getTranslations();
	
	const isLoggedUserOrAdmin = session.user.id === userId || session.user.isAdmin;
	
	const isLoggedUserAdmin = Boolean(session.user.isAdmin);
	
	const [ assignments, periods ] = await (
		isLoggedUserOrAdmin
			? Promise.all([
				api.user.getUserAssignments({
					userId,
					role,
				}),
				api.user.getUserPeriodsById(userId),
			])
			: Promise.all([
				api.user.getUserAssignments({
					userId,
					role,
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
					dir={textDir}
				>
					{
						assignments &&
						<TabsTrigger
							value="assignments"
							className="capitalize"
						>
							{t("Profile.assignments")}
						</TabsTrigger>
					}
					{
						periods &&
						<TabsTrigger
							value="periods"
							className="capitalize"
						>
							{t("Profile.roles")}
						</TabsTrigger>
					}
				</TabsList>
				{
					assignments &&
					<TabsContent
						value="assignments"
						dir={textDir}
					>
						<DutyAssignments assignments={assignments} />
					</TabsContent>
				}
				{
					periods &&
					<TabsContent
						value="periods"
						dir={textDir}
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

