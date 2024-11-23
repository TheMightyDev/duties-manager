import { UserRoleMark } from "@/app/_components/svg-icons/user-roles/user-role-mark";
import { type UserJusticeTableColId, usersJusticeTableColTitles } from "@/app/_utils/justice/users-justice-table-cols";
import { type UsersJusticeTableSettings } from "@/app/user-dashboard/justice/types";
import { type UserJustice } from "@/types/justice/user-justice";
import { redirect } from "next/navigation";
import { type MutableRefObject } from "react";

interface JusticeTableDesktopProps {
	settingsRef: MutableRefObject<UsersJusticeTableSettings>
	;
	usersJusticeSorted: UserJustice[];
	changeColIdToSortBy: (colId: UserJusticeTableColId) => void;
}

export function JusticeTableDesktop({
	settingsRef,
	usersJusticeSorted,
	changeColIdToSortBy,
}: JusticeTableDesktopProps) {
	return (
		<>
			<table className="text-center">
				<thead>
					<tr>
						{
							Object.entries(usersJusticeTableColTitles).map(([ id, title ]) => (
								<th
									key={id}
									onClick={() => {
										changeColIdToSortBy(id as UserJusticeTableColId);
									}}
									className="cursor-pointer p-2"
								>
									{title}
									{
										id === settingsRef.current.sortParams.colIdToSortBy &&
										<span className="inline-block w-6 font-normal">
											{settingsRef.current.sortParams.ascending ? "↑" : "↓"}
										</span>
									}
								</th>
							))
						}
					</tr>
				</thead>
				<tbody>
					{
						usersJusticeSorted.map(({
							userId,
							userFullName,
							role,
							weightedScore,
							monthsInRole,
							weekdaysGuardingCount,
							weekendsGuardingCount,
							otherDutiesScoreSum,
						}) => (
							<tr
								key={userId}
								className="h-10 cursor-pointer odd:bg-slate-50 even:bg-slate-200 hover:bg-slate-300"
								onClick={() => {
									redirect(`/user-dashboard/profile/${userId}/${role}`);
								}}
							>
								<th className="pe-4 ps-2 text-start">{userFullName}</th>
								<td><UserRoleMark role={role}/></td>
								<th className="font-mono">{weightedScore.toFixed(2)}</th>
								<td>{monthsInRole.toFixed(2)}</td>
								<td>{weekdaysGuardingCount}</td>
								<td>{weekendsGuardingCount}</td>
								<td>{otherDutiesScoreSum}</td>
							</tr>
						))
					}
				</tbody>
			</table>
		</>
	);
};
