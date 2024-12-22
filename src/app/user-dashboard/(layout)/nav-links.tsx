"use client";

import { cn } from "@/app/_utils";
import { checkIfOnRoute } from "@/app/user-dashboard/(layout)/check-if-on-route";
import { type LinkGroupProps } from "@/app/user-dashboard/(layout)/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinksProps = LinkGroupProps;

export function NavLinks({ routeInfos, loggedUserId }: NavLinksProps) {
	const pathname = usePathname();
	
	return (
		<>
			{routeInfos.map((routeInfo) => {
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
						className={cn(
							"flex h-[48px] grow flex-row  items-center justify-center gap-2 rounded-md bg-gray-50 text-sm font-medium   md:flex-none md:justify-start p-1",
							isOnRoute
								? " bg-sky-100 hover:bg-sky-100 text-blue-600 font-semibold"
								: " hover:bg-sky-100 hover:text-blue-600"
							
						)}
					>
						{
							isOnRoute
								? routeInfo.selectedIcon
								: routeInfo.icon
						}
						<span className="grow capitalize">
							{routeInfo.name}
						</span>
					</Link>
				);
			})}
		</>
	);
}
