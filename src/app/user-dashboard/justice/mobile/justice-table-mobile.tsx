"use client";

import { LightArrowDownSvgIcon } from "@/app/_components/svg-icons/ui/light-arrow-down-svg-icon";
import { AbsentOrExemptMark } from "@/app/_components/svg-icons/user-roles/absent-or-exempt-mark";
import { UserRoleMark } from "@/app/_components/svg-icons/user-roles/user-role-mark";
import { JusticeTableMobileExpand } from "@/app/user-dashboard/justice/mobile/justice-table-mobile-expand";
import { type UserJustice } from "@/types/justice/user-justice";
import { PeriodStatus } from "@prisma/client";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

interface JusticeTableMobileProps {
	usersJusticeSorted: UserJustice[];
	isLoggedUserAdmin: boolean;
}

export function JusticeTableMobile({
	usersJusticeSorted,
	isLoggedUserAdmin,
}: JusticeTableMobileProps) {
	return (
		<>
			<div>
				{
					usersJusticeSorted.map((userJustice) => (
						<details
							className="group/user-record select-none odd:bg-slate-200 even:bg-slate-300"
							key={userJustice.userId}
						>
							<summary className="flex h-10 items-center bg-black/10 px-2 text-lg">
								<div className="w-2/5">
									{userJustice.userFullName}
									{
										userJustice.latestPeriodStatus !== PeriodStatus.FULFILLS_ROLE &&
										<AbsentOrExemptMark
											periodStatus={userJustice.latestPeriodStatus}
											isLoggedUserAdmin={isLoggedUserAdmin}
										/>
									}
								</div>
								<div className="w-1/6">
									<UserRoleMark role={userJustice.role} />
								</div>
								<div className="text-start font-mono">
									{userJustice.weightedScore.toFixed(2)}
								</div>
								<div className="flex w-1/12 flex-1 justify-center">
									<Link href={`/user-dashboard/profile/${userJustice.userId}/${userJustice.role}`}>
										<ExternalLinkIcon className="stroke-slate-600" />
									</Link>
								</div>
								<div className="flex flex-row gap-4">
									<LightArrowDownSvgIcon className="size-4 transition-transform duration-200 group-open/user-record:-rotate-180"/>
								</div>
							</summary>
							<JusticeTableMobileExpand userJustice={userJustice} />
						</details>
					))
				}
			</div>
		</>
	);
};
