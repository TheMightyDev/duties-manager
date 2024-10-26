import { Dialog } from "@/app/_components/dialog/dialog";
import { type UserJusticeTableColId } from "@/app/_utils/justice/users-justice-table-cols";
import { SortSettingsSection } from "@/app/user-dashboard/justice/edit-settings-dialog/sort-params-section";
import { type UsersJusticeTableSettings } from "@/app/user-dashboard/justice/types";
import { type MutableRefObject, useEffect, useRef } from "react";

interface EditSettingsDialogProps {
	isOpen: boolean;
	settingsRef: MutableRefObject<UsersJusticeTableSettings>
	;
	applyChanges: (nextSettings: Partial<UsersJusticeTableSettings>) => void;
	closeDialog: () => void;
}

export function EditSettingsDialog({
	isOpen,
	settingsRef,
	applyChanges,
	closeDialog,
}: EditSettingsDialogProps) {
	const sortByColIdSelectRef = useRef<HTMLSelectElement>(null);
	const isAscendingInputRef = useRef<HTMLInputElement>(null);
	
	useEffect(() => {
		if (isOpen) {
			sortByColIdSelectRef.current!.value = settingsRef.current.sortParams.colIdToSortBy;
			isAscendingInputRef.current!.checked = settingsRef.current.sortParams.ascending;
		}
	}, [ isOpen ]);
	
	const closeAndApplyChanges = () => {
		applyChanges({
			sortParams: {
				colIdToSortBy: sortByColIdSelectRef.current!.value as UserJusticeTableColId,
				ascending: isAscendingInputRef.current!.checked,
			},
		});
		
		closeDialog();
	};
	
	return (
		<Dialog isOpen={isOpen}>
			<SortSettingsSection
				sortByColIdSelectRef={sortByColIdSelectRef}
				isAscendingInputRef={isAscendingInputRef}
			/>
			<button onClick={closeDialog}>
				ביטול
			</button>
			<button onClick={closeAndApplyChanges}>
				החלה
			</button>
		</Dialog>
	);
};
