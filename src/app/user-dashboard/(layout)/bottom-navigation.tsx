"use client";

import { checkIfOnRoute } from "@/app/user-dashboard/(layout)/checkIfOnRoute";
import { type LinkGroupProps } from "@/app/user-dashboard/(layout)/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

type BottomNavigationProps = LinkGroupProps;

export function BottomNavigation({ routeInfos, loggedUserId }: BottomNavigationProps) {
	const pathname = usePathname();
	
	return (
		<div className="me-4 flex h-[10vh] min-h-16 w-screen flex-row justify-around bg-white  text-slate-800 dark:bg-slate-800 dark:text-white md:hidden">
			{
				routeInfos.map((routeInfo) => {
					const isOnRoute = checkIfOnRoute({
						routeInfos,
						pathname,
						routeId: routeInfo.id,
						loggedUserId,
					});
					
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
