import { JUSTICE_TABLE_SETTINGS_LOCAL_STORAGE_KEY } from "@/app/_utils/constants";
import { sortUsersJustice } from "@/app/_utils/justice/sort-users-justice";
import { type UserJusticeTableColId } from "@/app/_utils/justice/users-justice-table-cols";
import { type FetchUsersJusticeFunc, type UsersJusticeTableSettings } from "@/app/user-dashboard/justice/types";
import { type UserJustice } from "@/types/justice/user-justice";
import { UserRole } from "@prisma/client";
import { type Dispatch, type MutableRefObject, type SetStateAction, useEffect, useRef, useState } from "react";

interface Params {
	fetchUsersJustice: FetchUsersJusticeFunc;
	loggedUserLatestRole?: UserRole;
}

export interface UseJusticeOverviewReturn {
	usersJusticeSorted: UserJustice[];
	settingsRef: MutableRefObject<UsersJusticeTableSettings>
	;
	setSettings: (nextSettings: Partial<UsersJusticeTableSettings>) => void;
	changeColIdToSortBy: (colId: UserJusticeTableColId) => void;
	isEditSettingsDialogOpen: boolean;
	setIsEditSettingsDialogOpen: Dispatch<SetStateAction<boolean>>;
	loggedUserLatestRole?: UserRole;
}

function getInitialJusticeOverview(loggedUserLatestRole?: UserRole): UsersJusticeTableSettings {
	const localStorageCache = localStorage.getItem(JUSTICE_TABLE_SETTINGS_LOCAL_STORAGE_KEY);
		
	if (localStorageCache) {
		const parsed = JSON.parse(localStorageCache) as UsersJusticeTableSettings ;
		parsed.fetchParams.definitiveDate = new Date(parsed.fetchParams.definitiveDate as unknown as string);
		
		return parsed as UsersJusticeTableSettings;
	} else {
		return {
			fetchParams: {
				roles: [ loggedUserLatestRole ?? UserRole.SQUAD ],
				definitiveDate: new Date(),
				includeExemptAndAbsentUsers: true,
			},
			sortParams: {
				colIdToSortBy: "weightedScore",
				ascending: false,
			},
		};
	}
}
export function useJusticeOverview({
	fetchUsersJustice,
	loggedUserLatestRole,
}: Params): UseJusticeOverviewReturn {
	const settingsRef = useRef<UsersJusticeTableSettings>(getInitialJusticeOverview(loggedUserLatestRole));
	
	const [ isEditSettingsDialogOpen, setIsEditSettingsDialogOpen ] = useState<boolean>(false);
	const [ usersJusticeSortedAndFiltered, setUsersJusticeSortedAndFiltered ] = useState<UserJustice[]>([]);
	
	useEffect(() => {
		fetchAndSortUsersJustice();
	}, []);
	
	function sortAndSetUsersJustice(unsortedUserJustice: UserJustice[]) {
		const sortedUsersJustice = sortUsersJustice({
			usersJustice: unsortedUserJustice,
			...settingsRef.current.sortParams,
		});
				
		setUsersJusticeSortedAndFiltered([
			...sortedUsersJustice,
		]);
	}
	
	function fetchAndSortUsersJustice() {
		fetchUsersJustice(settingsRef.current.fetchParams).then(
			(unsortedUsersJustice) => {
				sortAndSetUsersJustice(unsortedUsersJustice);
			}
		);
	}
	
	function updateLocalStorage() {
		localStorage.setItem(
			JUSTICE_TABLE_SETTINGS_LOCAL_STORAGE_KEY,
			JSON.stringify(settingsRef.current)
		);
	}
	
	function changeSettings(nextSettings: Partial<UsersJusticeTableSettings>) {
		// If the fetch settings changed
		if (nextSettings.fetchParams && JSON.stringify(nextSettings.fetchParams) !== JSON.stringify(settingsRef.current.fetchParams)) {
			settingsRef.current = {
				...settingsRef.current,
				...nextSettings,
			};
			
			fetchAndSortUsersJustice();
			updateLocalStorage();
			
			return;
		} else if (nextSettings.sortParams && JSON.stringify(nextSettings.sortParams) !== JSON.stringify(settingsRef.current.sortParams)) {
			settingsRef.current = {
				...settingsRef.current,
				...nextSettings,
			};
			
			sortAndSetUsersJustice(usersJusticeSortedAndFiltered);
			updateLocalStorage();
		}
	}
	
	function changeColIdToSortBy(colId: UserJusticeTableColId) {
		settingsRef.current.sortParams = {
			colIdToSortBy: colId,
			ascending: settingsRef.current.sortParams.colIdToSortBy === colId ? !settingsRef.current.sortParams.ascending : true,
		};
			
		sortAndSetUsersJustice(usersJusticeSortedAndFiltered);
	}
	
	return {
		usersJusticeSorted: usersJusticeSortedAndFiltered,
		settingsRef,
		setSettings: changeSettings,
		changeColIdToSortBy,
		isEditSettingsDialogOpen,
		setIsEditSettingsDialogOpen,
		loggedUserLatestRole,
	};
}
