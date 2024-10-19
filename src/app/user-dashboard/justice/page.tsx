import { sortUserJusticesByFullName, sortUserJusticesByTotalMonthsInRole, sortUserJusticesByWeightedScore } from "@/app/_utils/sort-user-justices";
import { UserJusticeSortBy, type FetchJusticeParams } from "@/app/user-dashboard/justice/types";
import { api } from "@/trpc/server";
import { UserRole } from "@prisma/client";
import { type NextPage } from "next";

const JusticePage: NextPage = async () => {
	async function fetchJustice({
		roles,
		definitiveDate,
		sortBy,
		shouldSortAscending,
	}: FetchJusticeParams) {
		"use server";
		
		const userJustices = await api.justice.getUsersJustice({
			roles,
			definitiveDate,
		});
		
		switch (sortBy) {
			case UserJusticeSortBy.WeightedScore:
				return sortUserJusticesByWeightedScore({
					userJustices,
					ascending: shouldSortAscending,
				});
			case UserJusticeSortBy.FullName:
				return sortUserJusticesByFullName({
					userJustices,
					ascending: shouldSortAscending,
				});
			case UserJusticeSortBy.TotalMonthsInRole:
				return sortUserJusticesByTotalMonthsInRole({
					userJustices,
					ascending: shouldSortAscending,
				});
			default:
				return userJustices;
		}
	};
	
	return (
		<>
			<pre dir="ltr">
				{ JSON.stringify(await fetchJustice({
					roles: [ UserRole.SQUAD ],
					definitiveDate: new Date(),
					sortBy: UserJusticeSortBy.WeightedScore,
					shouldSortAscending: true,
				}), null, 2) }
			</pre>
		</>
	);
};

export default JusticePage;
