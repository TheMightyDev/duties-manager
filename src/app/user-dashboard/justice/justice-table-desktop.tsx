import { type UserJustice } from "@/app/_types/justice/user-justice";
import { type SortUsersJusticeParams } from "@/app/_utils/justice/sort-users-justice";
import { type UserJusticeTableColId, usersJusticeTableColTitles } from "@/app/_utils/justice/users-justice-table-cols";

interface JusticeTableDesktopProps {
	sortParams: SortUsersJusticeParams;
	usersJusticeSorted: UserJustice[];
	changeSortParams: (colId: UserJusticeTableColId) => void;
}

export function JusticeTableDesktop({
	sortParams,
	usersJusticeSorted,
	changeSortParams,
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
										changeSortParams(id as UserJusticeTableColId);
									}}
									className="cursor-pointer p-2"
								>
									{title}
									<span className="inline-block w-6 font-normal">
										{
											id === sortParams.colIdToSortBy &&
											(sortParams.ascending ? "↑" : "↓")
										}
									</span>
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
							weightedScore,
							monthsInRole,
							weekdaysGuardingCount,
							weekendsGuardingCount,
							otherDutiesScoreSum,
						}) => (
							<tr
								key={userId}
								className="h-10 odd:bg-slate-50 even:bg-slate-200 hover:bg-slate-300"
							>
								<th className="pe-4 ps-2 text-start">{userFullName}</th>
								<th>{weightedScore}</th>
								<td>{monthsInRole}</td>
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
