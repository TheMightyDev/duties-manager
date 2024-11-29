import { SideNav } from "@/app/_components/side-nav/side-nav";
import { CalendarFilledSvgIcon } from "@/app/_components/svg-icons/navigaton/calendar-filled-svg-icon";
import { CalendarSvgIcon } from "@/app/_components/svg-icons/navigaton/calendar-svg-icon";
import { JusticeFilledSvgIcon } from "@/app/_components/svg-icons/navigaton/justice-filled-svg-icon";
import { JusticeSvgIcon } from "@/app/_components/svg-icons/navigaton/justice-svg-icon";
import { MagicWandSvgIcon } from "@/app/_components/svg-icons/navigaton/magic-wand-svg-icon";
import { ProfileCircleFilledSvgIcon } from "@/app/_components/svg-icons/navigaton/profile-circle-filled-svg-icon";
import { ProfileCircleSvgIcon } from "@/app/_components/svg-icons/navigaton/profile-circle-svg-icon";
import { type RouteInfo } from "@/app/_types/route-info";
import { BottomNavigation } from "@/app/user-dashboard/bottom-navigation";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	const session = await auth();
	
	if (!session) {
		redirect("/api/auth/signin");
	}
	
	const loggedUserId = session.user.id;
	
	const routeInfos: RouteInfo[] = [
		{
			id: "calendar",
			name: "לוח שנה",
			href: "/user-dashboard/calendar",
			icon: <CalendarSvgIcon className="m-auto size-9 stroke-black"/>,
			selectedIcon: <CalendarFilledSvgIcon className="m-auto size-9 stroke-black"/>,
		},
		{
			id: "justice",
			name: "טבלת הצדק",
			href: "/user-dashboard/justice",
			icon: <JusticeSvgIcon className="m-auto size-9 fill-black p-0.5" />,
			selectedIcon: <JusticeFilledSvgIcon className="m-auto size-9 fill-white/80 p-0.5" />,
		},
		{
			id: "my-profile",
			name: "הפרופיל שלי",
			href: `/user-dashboard/profile/${loggedUserId}/LATEST`,
			icon: <ProfileCircleSvgIcon className="m-auto size-9 stroke-black"/>,
			selectedIcon: <ProfileCircleFilledSvgIcon className="m-auto size-9 fill-white/80"/>,
		},
		{
			id: "actions",
			name: "פעולות",
			href: "/user-dashboard/upload",
			icon: <MagicWandSvgIcon className="m-auto size-9 stroke-black"/>,
			selectedIcon: <MagicWandSvgIcon className="m-auto size-9 stroke-white/80"/>,
		},
	] as const;
	
	return (
		<div
			className="flex w-full flex-col md:flex-row"
		>
			<SideNav routeInfos={routeInfos} />
			<main className="max-h-[90vh] flex-auto overflow-y-auto pb-20 md:pb-0">
				{children}
			</main>
			<div className="fixed bottom-0">
				<div className="pointer-events-none  block h-8 w-screen bg-gradient-to-t from-white md:hidden"></div>
				<BottomNavigation
					routeInfos={routeInfos}
					loggedUserId={loggedUserId}
				/>
			</div>
		</div>
	);
}

