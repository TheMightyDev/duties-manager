"use client";

import { JusticeTableMobile } from "@/app/user-dashboard/justice/justice-table-mobile";
import { UserJusticeSortBy, type FetchUsersJusticeFunc } from "@/app/user-dashboard/justice/types";
import { useJusticeOverview } from "@/app/user-dashboard/justice/use-justice-overview";

interface JusticeOverviewProps {
	fetchUsersJustice: FetchUsersJusticeFunc;
}

export function JusticeOverview({ fetchUsersJustice }: JusticeOverviewProps) {
	const {
		usersJusticeSorted,
		handleSortByChange,
		handleShouldSortAscendingChange,
	} = useJusticeOverview({
		fetchUsersJustice,
	});
	
	return (
		<>
			<p>
				<input
					type="checkbox"
					id="should-sort-ascending"
					onChange={handleShouldSortAscendingChange}
				/>
				<label htmlFor="should-sort-ascending">מיון בסדר עולה</label>
			</p>
			<p>
				<select onChange={handleSortByChange}>
					{
						Object.entries(UserJusticeSortBy).map(([ title, sortBy ]) => (
							<option
								value={sortBy}
								key={sortBy}
							>
								{title} ({sortBy})
							</option>
						))
					}
				</select>
			</p>
			<JusticeTableMobile usersJusticeSorted={usersJusticeSorted} />
			<pre dir="ltr">
				{ JSON.stringify(usersJusticeSorted, null, 2) }
			</pre>
		</>
	);
};
