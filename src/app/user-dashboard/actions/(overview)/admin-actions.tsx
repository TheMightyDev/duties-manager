"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminActions() {
	const pathname = usePathname();
	const t = useTranslations();
	
	const className = "bg-gradient-to-r from-blue-400 to-blue-700 w-64 text-white p-2 rounded-xl inline-block";

	return (
		<>
			<h3>{t("Actions.Admin.title")}</h3>
			
			<div className="flex flex-col gap-2">
				<Link
					href={`${pathname}/upload/users`}
					prefetch={false}
					className={className}
				>
					{t("Actions.Admin.upload-users")}
				</Link>
				<Link
					href={`${pathname}/upload/guarding-assignments`}
					prefetch={false}
					className={className}
				
				>
					{t("Actions.Admin.upload-guarding-assignments")}
				</Link>
				<Link
					href={`${pathname}/sanity-checks`}
					prefetch={false}
					className={className}
				>
					{t("Actions.Admin.sanity-check")}
				</Link>
				<Link
					href={`${pathname}/sanity-check`}
					prefetch={false}
					className={className}
				>
					{t("Actions.Admin.create-users")} (SOON)
				</Link>
			</div>
		</>
	);
};
