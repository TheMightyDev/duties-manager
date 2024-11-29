"use client";

import { type RouteInfo } from "@/app/_types/route-info";
import { cn } from "@/app/_utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinksProps {
	loggedUserId: string;
	routeInfos: RouteInfo[];
}

export function NavLinks({ routeInfos, loggedUserId }: NavLinksProps) {
	const pathname = usePathname();
	
	function checkIfOnRoute(pageId: string) {
		if (pageId === "my-profile") {
			return pathname.startsWith(`/user-dashboard/profile/${loggedUserId}`);
		} else {
			const linkHref = routeInfos.find((link) => link.id === pageId);

			return linkHref?.href === pathname;
		}
	}
	
	return (
		<>
			{routeInfos.map((routeInfo) => {
				const isOnRoute = checkIfOnRoute(routeInfo.id);
				
				return (
					<Link
						key={routeInfo.id}
						href={routeInfo.href}
						className={cn(
							"flex h-[48px] grow flex-row  items-center justify-center gap-2 rounded-md bg-gray-50 text-sm font-medium   md:flex-none md:justify-start p-1",
							isOnRoute
								? " bg-blue-500 hover:bg-blue-500 text-white"
								: " hover:bg-sky-100 hover:text-blue-600"
							
						)}
					>
						{
							isOnRoute
								? routeInfo.selectedIcon
								: routeInfo.icon
						}
						<span className="grow">
							{routeInfo.name}
						</span>
					</Link>
				);
			})}
		</>
	);
}
