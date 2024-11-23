"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinksProps {
	loggedUserId: string;
}
export function NavLinks({ loggedUserId }: NavLinksProps) {
	const pathname = usePathname();
	
	// Map of links to display in the side navigation.
	// Depending on the size of the application, this would be stored in a database.
	const links = [
		{
			id: "calendar",
			name: "לוח שנה",
			href: "/user-dashboard/calendar",
		},
		{
			id: "justice",
			name: "טבלת הצדק",
			href: "/user-dashboard/justice",
		},
		{
			id: "my-profile",
			name: "הפרופיל שלי",
			href: `/user-dashboard/profile/${loggedUserId}/LATEST`,
		},
	];
	console.log("pathname", pathname);
	
	function isOnPage(pageId: string) {
		if (pageId === "my-profile") {
			return pathname.startsWith(`/user-dashboard/profile/${loggedUserId}`);
		} else {
			const linkHref = links.find((link) => link.id === pageId);

			return linkHref?.href === pathname;
		}
	}
	
	return (
		<>
			{links.map((link) => {
				return (
					<Link
						key={link.id}
						href={link.href}
						className={clsx(
							"flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
							isOnPage(link.id) && "bg-sky-100 text-blue-600"
						)}
					>
						<p className="hidden md:block">{link.name}</p>
					</Link>
				);
			})}
		</>
	);
}
