"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminActions() {
	const pathname = usePathname();
	
	return (
		<>
			<div>
				פעולות ניהול
			</div>
			<Link href={`${pathname}/upload/users`}>
				העלאת משתמשים
			</Link>
			<Link
				href={`${pathname}/upload/assignments`}
				prefetch={false}
			>
				העלאת שיבוצים ותורנויות
			</Link>
		</>
	);
};
