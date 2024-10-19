import { type FetchUsersJusticeFunc, type FetchUsersJusticeParams, type SortUsersJusticeParams, UserJusticeSortBy, type UsersJusticeCompareFn } from "@/app/user-dashboard/justice/types";
import { type UserJustice } from "@/server/api/types/user-justice";
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

function getUsersJusticeCompareFn({
	sortBy,
	ascending,
}: SortUsersJusticeParams): UsersJusticeCompareFn {
	switch (sortBy) {
		case UserJusticeSortBy.WeightedScore:
			return (a: UserJustice, b: UserJustice) => (b.weightedScore - a.weightedScore) * (ascending ? -1 : 1);
		case UserJusticeSortBy.FullName:
			return (a: UserJustice, b: UserJustice) => (b.userFullName > a.userFullName ? 1 : -1) * (ascending ? -1 : 1);
		case UserJusticeSortBy.TotalMonthsInRole:
			return (a: UserJustice, b: UserJustice) => (b.monthsInRole - a.monthsInRole) * (ascending ? -1 : 1);
		default:
			return (_a: UserJustice, _b: UserJustice) => 1;
	}
}

export function useJusticeOverview({ fetchUsersJustice }: Params): Return {
	const [ fetchParams, setFetchParams ] = useState<FetchUsersJusticeParams>({
		roles: [ UserRole.SQUAD ],
		definitiveDate: new Date(),
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
		const compareFn = getUsersJusticeCompareFn({
			sortBy,
			ascending,
		});
		
		setUsersJusticeSorted(usersJusticeUnsorted.sort(compareFn));
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
