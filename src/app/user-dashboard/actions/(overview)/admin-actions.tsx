"use client";

import { Button } from "@/app/_components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminActions() {
	const pathname = usePathname();
	
	return (
		<>
			{
				<div>
					פעולות ניהול
					<Link href={`${pathname}/upload-users`}>
						<Button>
							העלאת משתמשים
						</Button>
					</Link>
				</div>
			}
		</>
	);
};
