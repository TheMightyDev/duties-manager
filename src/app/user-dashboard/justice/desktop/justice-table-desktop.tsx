import { AbsentOrExemptMark } from "@/app/_components/svg-icons/user-roles/absent-or-exempt-mark";
import { UserRoleMark } from "@/app/_components/svg-icons/user-roles/user-role-mark";
import { type UserJusticeTableColId, usersJusticeTableColTitles } from "@/app/_utils/justice/users-justice-table-cols";
import { type UsersJusticeTableSettings } from "@/app/user-dashboard/justice/types";
import { type UserJustice } from "@/types/justice/user-justice";
import { PeriodStatus } from "@prisma/client";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { type MutableRefObject } from "react";

interface JusticeTableDesktopProps {
	settingsRef: MutableRefObject<UsersJusticeTableSettings>
	;
	usersJusticeSorted: UserJustice[];
	changeColIdToSortBy: (colId: UserJusticeTableColId) => void;
	isLoggedUserAdmin: boolean;
}

export function JusticeTableDesktop({
	settingsRef,
	usersJusticeSorted,
	changeColIdToSortBy,
	isLoggedUserAdmin,
}: JusticeTableDesktopProps) {
	return (
		<>
			<table className="p-2 text-center">
				<thead>
					<tr className="sticky top-0 z-10 bg-white [&_th]:text-center">
						{
							Object.entries(usersJusticeTableColTitles).map(([ id, title ]) => (
								<th
									key={id}
									onClick={() => {
										changeColIdToSortBy(id as UserJusticeTableColId);
									}}
									className="relative cursor-pointer p-2"
								>
									{title}
									{
										id === settingsRef.current.sortParams.colIdToSortBy &&
										<span className="absolute inline-block w-6 font-normal">
											{settingsRef.current.sortParams.ascending ? "↑" : "↓"}
										</span>
									}
								</th>
							))
						}
						{/* For more information buttons */}
						<th></th>
					</tr>
				</thead>
				<tbody>
					{
						usersJusticeSorted.map(({
							userId,
							userFullName,
							latestPeriodStatus,
							role,
							weightedScore,
							monthsInRole,
							weekdaysGuardingCount,
							weekendsGuardingCount,
							campAndSettlementDefenseCount,
							otherDutiesScoreSum,
						}) => (
							<tr
								key={userId}
								className="h-10 odd:bg-slate-50 even:bg-slate-200 hover:bg-slate-300"
							>
								<th className="pe-4 ps-2 text-start">
									{userFullName}
									{
										latestPeriodStatus !== PeriodStatus.FULFILLS_ROLE &&
										<AbsentOrExemptMark
											periodStatus={latestPeriodStatus}
											isLoggedUserAdmin={isLoggedUserAdmin}
										/>
									}
								</th>
								<td><UserRoleMark role={role}/></td>
								<th className="font-mono">{weightedScore.toFixed(2)}</th>
								<td>{monthsInRole.toFixed(2)}</td>
								<td>{weekdaysGuardingCount}</td>
								<td>{weekendsGuardingCount}</td>
								<td>{campAndSettlementDefenseCount}</td>
								<td>{otherDutiesScoreSum}</td>
								<td className="px-2">
									<Link
										href={`/user-dashboard/profile/${userId}/${role}`}
									>
										<ExternalLinkIcon />
									</Link>
								</td>
							</tr>
						))
					}
				</tbody>
			</table>
		</>
	);
};
