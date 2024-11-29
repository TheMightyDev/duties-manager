import { DefinitiveDateSelector } from "@/app/user-dashboard/justice/edit-settings-dialog/definitive-date-selector";
import { UserRolesSelector } from "@/app/user-dashboard/justice/edit-settings-dialog/user-roles-selector";
import { type UseJusticeOverviewReturn } from "@/app/user-dashboard/justice/use-justice-overview";
import { UserRole } from "@prisma/client";
import { useRef } from "react";

export function JusticeTableHeader({
	setIsEditSettingsDialogOpen,
	settingsRef,
	setSettings,
	loggedUserLatestRole,
}: UseJusticeOverviewReturn) {
	const rolesCheckboxRefs: Record<UserRole, React.RefObject<HTMLInputElement>> = {
		[UserRole.SQUAD]: useRef<HTMLInputElement>(null),
		[UserRole.OFFICER]: useRef<HTMLInputElement>(null),
		[UserRole.COMMANDER]: useRef<HTMLInputElement>(null),
		[UserRole.EXEMPT]: useRef<HTMLInputElement>(null),
	};
	
	function handleRolesSelectionChange(roles: UserRole[]) {
		setSettings({
			fetchParams: {
				...settingsRef.current.fetchParams,
				roles,
			},
		});
	}
	
	function handleDefinitiveDateChange(nextDefinitiveDate: Date) {
		setSettings({
			fetchParams: {
				...settingsRef.current.fetchParams,
				definitiveDate: nextDefinitiveDate,
			},
		});
		console.log("@nextDefinitiveDate", nextDefinitiveDate);
	}
	
	const definitiveDateKindSelectRef = useRef<HTMLSelectElement>(null);
	const customDefinitiveDateInputRef = useRef<HTMLInputElement>(null);
	
	return (
		<div className="flex flex-row items-center gap-4">
			<h3 className="text-2xl font-bold ">
				טבלת הצדק
			</h3>
			{/* <button onClick={() => {
				setIsEditSettingsDialogOpen(true);
			}}
			>
				הגדרות
			</button> */}
			<DefinitiveDateSelector
				kindSelectRef={definitiveDateKindSelectRef}
				customDateInputRef={customDefinitiveDateInputRef}
				handleDefinitiveDateChange={handleDefinitiveDateChange}
			/>
			<UserRolesSelector
				rolesCheckboxRefs={rolesCheckboxRefs}
				defaultCheckedRoles={settingsRef.current.fetchParams.roles}
				handleRolesSelectionChange={handleRolesSelectionChange}
			/>
		</div>
	);
};
