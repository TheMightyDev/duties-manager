import { Button } from "@/app/_components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/app/_components/ui/dialog";
import { type UserJusticeTableColId } from "@/app/_utils/justice/users-justice-table-cols";
import { DefinitiveDateSelector } from "@/app/user-dashboard/justice/edit-settings-dialog/definitive-date-selector";
import { SortSettingsSection } from "@/app/user-dashboard/justice/edit-settings-dialog/sort-params-section";
import { UserRolesSelector } from "@/app/user-dashboard/justice/edit-settings-dialog/user-roles-selector";
import { DefinitiveDateKind, type UsersJusticeTableSettings } from "@/app/user-dashboard/justice/types";
import { type RefObject } from "@fullcalendar/core/preact.js";
import { UserRole } from "@prisma/client";
import { endOfDay, endOfMonth, startOfMonth } from "date-fns";
import { type MutableRefObject, useEffect, useRef } from "react";

interface EditSettingsDialogProps {
	isOpen: boolean;
	settingsRef: MutableRefObject<UsersJusticeTableSettings>
	;
	applyChanges: (nextSettings: Partial<UsersJusticeTableSettings>) => void;
	closeDialog: () => void;
}

function getActualDefinitiveDate({ kind, customDate }: {
	kind: DefinitiveDateKind;
	customDate?: Date;
}): Date {
	const currDate = new Date();
	
	switch (kind) {
		case DefinitiveDateKind.TODAY:
			return endOfDay(currDate);
		case DefinitiveDateKind.START_OF_CURRENT_MONTH:
			return startOfMonth(currDate);
		case DefinitiveDateKind.END_OF_CURRENT_MONTH:
			return endOfMonth(currDate);
		case DefinitiveDateKind.CUSTOM:
			return customDate ?? startOfMonth(currDate);
		// There's no need for default because one of
		// the kinds must be selected
	}
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
	const definitiveDateKindSelectRef = useRef<HTMLSelectElement>(null);
	const customDefinitiveDateInputRef = useRef<HTMLInputElement>(null);
	
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
		
		const kind = definitiveDateKindSelectRef.current?.value as DefinitiveDateKind;
		const customDate = customDefinitiveDateInputRef.current?.value ? new Date(customDefinitiveDateInputRef.current.value) : undefined;
		
		const m = getActualDefinitiveDate({
			kind,
			customDate,
		});
		
		console.log("@kind", kind, customDate, m);
					
		applyChanges({
			sortParams: {
				colIdToSortBy: sortByColIdSelectRef.current!.value as UserJusticeTableColId,
				ascending: isAscendingInputRef.current!.checked,
			},
			fetchParams: {
				roles: selectedRoles,
				definitiveDate: getActualDefinitiveDate({
					kind: definitiveDateKindSelectRef.current?.value as DefinitiveDateKind,
					customDate: customDefinitiveDateInputRef.current?.value ? new Date(customDefinitiveDateInputRef.current.value) : undefined,
				}),
				includeExemptAndAbsentUsers: true,
			},
		});
		
		closeDialog();
	};
	
	return (
		<Dialog>
			<DialogTrigger>rr</DialogTrigger>
			<DialogContent>
				
				<UserRolesSelector rolesCheckboxRefs={rolesCheckboxRefs} />
				<SortSettingsSection
					sortByColIdSelectRef={sortByColIdSelectRef}
					isAscendingInputRef={isAscendingInputRef}
				/>
			
				<DefinitiveDateSelector
					kindSelectRef={definitiveDateKindSelectRef}
					customDateInputRef={customDefinitiveDateInputRef}
				/>
			
				<Button
					onClick={closeDialog}
					variant="ghost"
				>
					ביטול
				</Button>
				<Button
					onClick={closeAndApplyChanges}
					className="bg-blue-500 hover:bg-blue-600"
				>
					החלה
				</Button>
			</DialogContent>
		</Dialog>
	);
};
