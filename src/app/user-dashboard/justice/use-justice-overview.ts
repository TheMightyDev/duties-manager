import { type UserJustice } from "@/app/_types/justice/user-justice";
import { sortUsersJustice, type SortUsersJusticeParams, UserJusticeSortBy } from "@/app/_utils/justice/sort-users-justice";
import { type FetchUsersJusticeFunc, type FetchUsersJusticeParams } from "@/app/user-dashboard/justice/types";
import { UserRole } from "@prisma/client";
import { type ChangeEvent, type Dispatch, type SetStateAction, useEffect, useState } from "react";

interface Params {
	fetchUsersJustice: FetchUsersJusticeFunc;
}

interface Return {
	fetchParams: FetchUsersJusticeParams;
	setFetchParams: Dispatch<SetStateAction<FetchUsersJusticeParams>>;
	usersJusticeSorted: UserJustice[];
	handleSortByChange: (e: ChangeEvent<HTMLSelectElement>) => void;
	handleShouldSortAscendingChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function useJusticeOverview({ fetchUsersJustice }: Params): Return {
	const [ fetchParams, setFetchParams ] = useState<FetchUsersJusticeParams>({
		roles: [ UserRole.SQUAD ],
		definitiveDate: new Date(),
		includeExemptAndAbsentUsers: true,
	});
	
	const [ sortParams, setSortParams ] = useState<SortUsersJusticeParams>({
		sortBy: UserJusticeSortBy.WeightedScore,
		ascending: false,
	});
	
	const [ usersJusticeSorted, setUsersJusticeSorted ] = useState<UserJustice[]>([]);
	
	useEffect(() => {
		fetchAndSortUsersJustice();
	}, []);
	
	function sortAndSetUsersJustice({
		sortBy,
		ascending,
		usersJusticeUnsorted,
	}: SortUsersJusticeParams & {
		usersJusticeUnsorted: UserJustice[];
	}) {
		const sortedUsersJustice = sortUsersJustice({
			sortBy,
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
	
	function handleShouldSortAscendingChange(e: ChangeEvent<HTMLInputElement>) {
		const isChecked = e.target.checked;
		
		setSortParams((prev) => {
			const nextSortParams: SortUsersJusticeParams = {
				...prev,
				ascending: isChecked,
			};
			
			sortAndSetUsersJustice({
				...nextSortParams,
				usersJusticeUnsorted: usersJusticeSorted,
			});
			
			return nextSortParams;
		});
	}
	
	function handleSortByChange(e: ChangeEvent<HTMLSelectElement>) {
		const nextSortBy = e.target.value as UserJusticeSortBy;
		
		setSortParams((prev) => {
			const nextSortParams: SortUsersJusticeParams = {
				...prev,
				sortBy: nextSortBy,
			};
			
			sortAndSetUsersJustice({
				...nextSortParams,
				usersJusticeUnsorted: usersJusticeSorted,
			});
			
			return nextSortParams;
		});
	}
	
	return {
		usersJusticeSorted,
		fetchParams,
		setFetchParams,
		handleSortByChange,
		handleShouldSortAscendingChange,
	};
}
