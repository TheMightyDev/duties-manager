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
		<div className="me-4 flex h-[10vh] max-h-16 min-h-12 w-screen flex-row items-center justify-between border-t-2 bg-white pt-1.5 text-slate-700 dark:bg-slate-800 dark:text-white sm:max-h-20 sm:min-h-18">
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
							className="flex h-[10vh] max-h-16 flex-1 flex-col items-center justify-around md:max-h-20"
						>
							<div className={clsx(
								"flex items-center",
								isOnRoute
									? "h-9 w-18 rounded-full bg-blue-200 transition-all sm:h-10 sm:w-20"
									: "size-9 sm:size-10"
							)}
							>
								{isOnRoute
									? routeInfo.selectedIcon
									: routeInfo.icon}
							</div>
							<span className={clsx(
								"capitalize",
								isOnRoute ? "text-sm font-bold" : "text-sm"
							)}
							>
								{routeInfo.name}
							</span>
						</Link>
					);
				})
			}
		</div>
	);
}
