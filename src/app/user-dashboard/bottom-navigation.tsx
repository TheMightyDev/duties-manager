"use client";

import { type RouteInfo } from "@/app/_types/route-info";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BottomNavigationProps {
	routeInfos: RouteInfo[];
	loggedUserId: string;
}

export function BottomNavigation(props: BottomNavigationProps) {
	const pathname = usePathname();

	function checkIfOnRoute(routeId: string) {
		if (routeId === "my-profile") {
			return pathname.startsWith(`/user-dashboard/profile/${props.loggedUserId}`);
		} else {
			const linkHref = props.routeInfos.find((info) => info.id === routeId);

			return linkHref?.href === pathname;
		}
	}
	
	return (
		<div className="flex flex-row justify-between  bg-white text-slate-800 dark:bg-slate-800 dark:text-white">
			{
				props.routeInfos.map((routeInfo) => {
					const isOnRoute = checkIfOnRoute(routeInfo.id);
					
					return (
						<Link
							key={routeInfo.id}
							href={routeInfo.href}
							className="flex flex-1 flex-col items-center"
						>
							<div className={
								isOnRoute ? "h-10 w-20 rounded-full bg-blue-800 leading-10 transition-all" : "size-10 leading-10"
							}
							>
								{isOnRoute
									? routeInfo.selectedIcon
									: routeInfo.icon}
							</div>
							<span className={isOnRoute ? "font-bold" : ""}>
								{routeInfo.name}
							</span>
						</Link>
					);
				})
			}
		</div>
	);
}
