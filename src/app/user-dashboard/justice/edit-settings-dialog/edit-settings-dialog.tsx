import { Dialog } from "@/app/_components/dialog/dialog";
import { type UserJusticeTableColId } from "@/app/_utils/justice/users-justice-table-cols";
import { SortSettingsSection } from "@/app/user-dashboard/justice/edit-settings-dialog/sort-params-section";
import { UserRolesSelector } from "@/app/user-dashboard/justice/edit-settings-dialog/user-roles-selector";
import { type UsersJusticeTableSettings } from "@/app/user-dashboard/justice/types";
import { type RefObject } from "@fullcalendar/core/preact.js";
import { UserRole } from "@prisma/client";
import { startOfDay } from "date-fns";
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
	const rolesCheckboxRefs: Record<UserRole, RefObject<HTMLInputElement>> = {
		[UserRole.SQUAD]: useRef<HTMLInputElement>(null),
		[UserRole.OFFICER]: useRef<HTMLInputElement>(null),
		[UserRole.COMMANDER]: useRef<HTMLInputElement>(null),
		[UserRole.EXEMPT]: useRef<HTMLInputElement>(null),
	};
	
	useEffect(() => {
		if (isOpen) {
			sortByColIdSelectRef.current!.value = settingsRef.current.sortParams.colIdToSortBy;
			isAscendingInputRef.current!.checked = settingsRef.current.sortParams.ascending;
			Object.entries(rolesCheckboxRefs).forEach(([ role, ref ]) => {
				ref.current!.checked = settingsRef.current.fetchParams.roles.includes(role as UserRole);
			});
		}
	}, [ isOpen ]);
	
	const closeAndApplyChanges = () => {
		const selectedRoles = Object.entries(rolesCheckboxRefs).reduce<UserRole[]>((selected, [ role, ref ]) => {
			if (ref.current?.checked) {
				return [
					...selected,
					role as UserRole,
				];
			}

			return selected;
		}, []);
		
		applyChanges({
			sortParams: {
				colIdToSortBy: sortByColIdSelectRef.current!.value as UserJusticeTableColId,
				ascending: isAscendingInputRef.current!.checked,
			},
			fetchParams: {
				roles: selectedRoles,
				definitiveDate: startOfDay(new Date()),
				includeExemptAndAbsentUsers: true,
			},
		});
		
		closeDialog();
	};
	
	return (
		<Dialog isOpen={isOpen}>
			<UserRolesSelector rolesCheckboxRefs={rolesCheckboxRefs} />
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
