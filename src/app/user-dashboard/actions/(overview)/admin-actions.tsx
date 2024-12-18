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
			
			<Link
				href={`${pathname}/upload/users`}
				prefetch={false}
			>
				העלאת משתמשים
			</Link>
			<Link
				href={`${pathname}/upload/guarding-assignments`}
				prefetch={false}
			>
				העלאת שיבוצים לשמירות
			</Link>
			<Link
				href={`${pathname}/sanity-checks`}
				prefetch={false}
			>
				בדיקת שפיות
			</Link>
		</>
	);
};
