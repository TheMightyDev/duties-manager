import { BottomNavigation } from "@/app/user-dashboard/(layout)/bottom-navigation";
import { SideNav } from "@/app/user-dashboard/(layout)/side-nav";
import { type LinkGroupProps } from "@/app/user-dashboard/(layout)/types";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";

import { CalendarFilledSvgIcon } from "@/app/_components/svg-icons/navigaton/calendar-filled-svg-icon";
import { CalendarSvgIcon } from "@/app/_components/svg-icons/navigaton/calendar-svg-icon";
import { JusticeFilledSvgIcon } from "@/app/_components/svg-icons/navigaton/justice-filled-svg-icon";
import { JusticeSvgIcon } from "@/app/_components/svg-icons/navigaton/justice-svg-icon";
import { MagicWandSvgIcon } from "@/app/_components/svg-icons/navigaton/magic-wand-svg-icon";
import { ProfileCircleFilledSvgIcon } from "@/app/_components/svg-icons/navigaton/profile-circle-filled-svg-icon";
import { ProfileCircleSvgIcon } from "@/app/_components/svg-icons/navigaton/profile-circle-svg-icon";
import { type RouteInfo } from "@/app/user-dashboard/(layout)/types";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	const session = await auth();
	
	if (!session) {
		redirect("/api/auth/signin");
	}
	
	const loggedUserId = session.user.id;
	
	const sharedIconClassName = "size-8 m-auto ";
	
	const routeInfos: RouteInfo[] = [
		{
			id: "calendar",
			name: "לוח שנה",
			href: "/user-dashboard/calendar",
			icon: <CalendarSvgIcon className={sharedIconClassName + "stroke-black"}/>,
			selectedIcon: <CalendarFilledSvgIcon className={sharedIconClassName + "stroke-blue-600"}/>,
		},
		{
			id: "justice",
			name: "טבלת הצדק",
			href: "/user-dashboard/justice",
			icon: <JusticeSvgIcon className={sharedIconClassName + "fill-black p-0.25"} />,
			selectedIcon: <JusticeFilledSvgIcon className={sharedIconClassName + "fill-blue-600 p-0.5"} />,
		},
		{
			id: "my-profile",
			name: "הפרופיל שלי",
			href: `/user-dashboard/profile/${loggedUserId}/LATEST`,
			icon: <ProfileCircleSvgIcon className={sharedIconClassName + "stroke-black"}/>,
			selectedIcon: <ProfileCircleFilledSvgIcon className={sharedIconClassName + "fill-blue-600"}/>,
		},
		{
			id: "actions",
			name: "פעולות",
			href: "/user-dashboard/actions",
			icon: <MagicWandSvgIcon className={sharedIconClassName + "stroke-black"}/>,
			selectedIcon: <MagicWandSvgIcon className={sharedIconClassName + "stroke-blue-600"}/>,
		},
	] as const;
	
	const linkGroupProps: LinkGroupProps = {
		loggedUserId,
		routeInfos,
	};
	
	return (
		<div
			className="flex w-full flex-col md:flex-row"
		>
			<SideNav {...linkGroupProps} />
			<main className="max-h-[90vh] flex-auto overflow-y-auto md:max-h-screen md:pb-0">
				{children}
			</main>
			<div className="fixed bottom-0 md:hidden">
				<BottomNavigation {...linkGroupProps}	/>
			</div>
		</div>
	);
}

