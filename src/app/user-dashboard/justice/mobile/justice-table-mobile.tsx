"use client";

import { LightArrowDownSvgIcon } from "@/app/_components/svg-icons/ui/light-arrow-down-svg-icon";
import { UserRoleMark } from "@/app/_components/svg-icons/user-roles/user-role-mark";
import { JusticeTableMobileExpand } from "@/app/user-dashboard/justice/mobile/justice-table-mobile-expand";
import { type UserJustice } from "@/types/justice/user-justice";

interface JusticeTableMobileProps {
	usersJusticeSorted: UserJustice[];
}

export function JusticeTableMobile({ usersJusticeSorted }: JusticeTableMobileProps) {
	return (
		<>
			<div>
				{
					usersJusticeSorted.map((userJustice) => (
						<details
							className="group select-none odd:bg-slate-200 even:bg-slate-300"
							key={userJustice.userId}
						>
							<summary className="flex h-10 items-center bg-black/10 px-2 text-lg">
								<div className="w-2/5">
									{userJustice.userFullName}
								</div>
								<div className="w-1/6">
									<UserRoleMark role={userJustice.role} />
								</div>
								<div className="flex-1 text-start font-mono">
									{userJustice.weightedScore.toFixed(2)}
								</div>
								<LightArrowDownSvgIcon className="size-4 transition-transform duration-200 group-open:-rotate-180"/>
							</summary>
							<JusticeTableMobileExpand userJustice={userJustice} />
						</details>
					))
				}
			</div>
		</>
	);
};
