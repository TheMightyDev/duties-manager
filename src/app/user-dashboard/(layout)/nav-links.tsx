"use client";

import { cn } from "@/app/_utils";
import { checkIfOnRoute } from "@/app/user-dashboard/(layout)/checkIfOnRoute";
import { routeInfos } from "@/app/user-dashboard/(layout)/routeInfos";
import { type LinkGroupProps } from "@/app/user-dashboard/(layout)/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinksProps = LinkGroupProps;

export function NavLinks({ loggedUserId }: NavLinksProps) {
	const pathname = usePathname();
	
	return (
		<>
			{routeInfos.map((routeInfo) => {
				const isOnRoute = checkIfOnRoute({
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
