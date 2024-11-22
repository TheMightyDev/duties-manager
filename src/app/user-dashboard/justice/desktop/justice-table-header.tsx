import { UserRolesSelector } from "@/app/user-dashboard/justice/edit-settings-dialog/user-roles-selector";
import { type UseJusticeOverviewReturn } from "@/app/user-dashboard/justice/use-justice-overview";
import { UserRole } from "@prisma/client";
import { endOfMonth } from "date-fns";
import { useRef } from "react";

export function JusticeTableHeader({
	setIsEditSettingsDialogOpen,
	setSettings,
}: UseJusticeOverviewReturn) {
	const rolesCheckboxRefs: Record<UserRole, React.RefObject<HTMLInputElement>> = {
		[UserRole.SQUAD]: useRef<HTMLInputElement>(null),
		[UserRole.OFFICER]: useRef<HTMLInputElement>(null),
		[UserRole.COMMANDER]: useRef<HTMLInputElement>(null),
		[UserRole.EXEMPT]: useRef<HTMLInputElement>(null),
	};
	
	return (
		<>
			<button onClick={() => {
				setIsEditSettingsDialogOpen(true);
			}}
			>
				הגדרות
			</button>
			<UserRolesSelector
				rolesCheckboxRefs={rolesCheckboxRefs}
				handleRolesSelectionChange={(roles) => {
					setSettings({
						fetchParams: {
							definitiveDate: endOfMonth(new Date()),
							includeExemptAndAbsentUsers: true,
							roles,
						},
					});
				}}
			/>
		</>
	);
};
