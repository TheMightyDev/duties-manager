"use client";

import { checkIfOnRoute } from "@/app/user-dashboard/(layout)/check-if-on-route";
import { type LinkGroupProps } from "@/app/user-dashboard/(layout)/types";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

type BottomNavigationProps = LinkGroupProps;

export function BottomNavigation({ routeInfos, loggedUserId }: BottomNavigationProps) {
	const pathname = usePathname();
	
	return (
		<div className="me-4 flex h-[10vh] min-h-16 w-screen flex-row items-center justify-between  border-t-2 bg-white text-slate-700 dark:bg-slate-800 dark:text-white ">
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
							className="flex  h-[10vh]   flex-1 flex-col items-center justify-around"
						>
							<div className={clsx(
								"flex items-center",
								isOnRoute
									? "h-9 w-18 rounded-full bg-blue-200 transition-all"
									: "size-9"
							)}
							>
								{isOnRoute
									? routeInfo.selectedIcon
									: routeInfo.icon}
							</div>
							<span className={(isOnRoute ? "font-bold" : "")}>
								{routeInfo.name}
							</span>
						</Link>
					);
				})
			}
		</div>
	);
}
