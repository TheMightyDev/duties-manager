import { type UserJustice } from "@/app/_types/justice/user-justice";
import { sortUsersJustice, type SortUsersJusticeParams } from "@/app/_utils/justice/sort-users-justice";
import { type UserJusticeTableColId } from "@/app/_utils/justice/users-justice-table-cols";
import { type FetchUsersJusticeFunc, type FetchUsersJusticeParams } from "@/app/user-dashboard/justice/types";
import { UserRole } from "@prisma/client";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

interface Params {
	fetchUsersJustice: FetchUsersJusticeFunc;
}

interface Return {
	fetchParams: FetchUsersJusticeParams;
	sortParams: SortUsersJusticeParams;
	usersJusticeSorted: UserJustice[];
	setFetchParams: Dispatch<SetStateAction<FetchUsersJusticeParams>>;
	changeSortParams: (colId: UserJusticeTableColId) => void;
}

export function useJusticeOverview({ fetchUsersJustice }: Params): Return {
	const [ fetchParams, setFetchParams ] = useState<FetchUsersJusticeParams>({
		roles: [ UserRole.SQUAD ],
		definitiveDate: new Date(),
		includeExemptAndAbsentUsers: true,
	});
	
	const [ sortParams, setSortParams ] = useState<SortUsersJusticeParams>({
		colIdToSortBy: "weightedScore",
		ascending: false,
	});
	
	const [ usersJusticeSorted, setUsersJusticeSorted ] = useState<UserJustice[]>([]);
	
	useEffect(() => {
		fetchAndSortUsersJustice();
	}, []);
	
	function sortAndSetUsersJustice({
		colIdToSortBy,
		ascending,
		usersJusticeUnsorted,
	}: SortUsersJusticeParams & {
		usersJusticeUnsorted: UserJustice[];
	}) {
		const sortedUsersJustice = sortUsersJustice({
			colIdToSortBy,
			ascending,
			usersJustice: usersJusticeUnsorted,
		});
		
		setUsersJusticeSorted(sortedUsersJustice);
	}
	
	function fetchAndSortUsersJustice() {
		fetchUsersJustice(fetchParams).then(
			(usersJusticeUnsorted) => {
				sortAndSetUsersJustice({
					...sortParams,
					usersJusticeUnsorted,
				});
			}
		);
	}
	
	function changeSortParams(colId: UserJusticeTableColId) {
		setSortParams((prev) => {
			const nextSortParams: SortUsersJusticeParams = {
				colIdToSortBy: colId,
				ascending: prev.colIdToSortBy === colId ? !prev.ascending : true,
			};
			
			sortAndSetUsersJustice({
				...nextSortParams,
				usersJusticeUnsorted: usersJusticeSorted,
			});
			
			return nextSortParams;
		});
	}
	
	return {
		fetchParams,
		sortParams,
		usersJusticeSorted,
		setFetchParams,
		changeSortParams,
	};
}
