"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
	{
		name: "לוח שנה",
		href: "/user-dashboard/calendar",
	},
	{
		name: "טבלת הצדק",
		href: "/user-dashboard/justice",
	},
	{
		name: "בקשות החלפה",
		href: "/dashboard/customers",
	},
];

export default function NavLinks() {
	const pathname = usePathname();
	console.log("pathname", pathname);
	
	return (
		<>
			{links.map((link) => {
				return (
					<Link
						key={link.name}
						href={link.href}
						className={clsx(
							"flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
							pathname === link.href && "bg-sky-100 text-blue-600"
						)}
					>
						<p className="hidden md:block">{link.name}</p>
					</Link>
				);
			})}
		</>
	);
}
