import { UserRolesSelector } from "@/app/user-dashboard/justice/edit-settings-dialog/user-roles-selector";
import { type UseJusticeOverviewReturn } from "@/app/user-dashboard/justice/use-justice-overview";
import { UserRole } from "@prisma/client";
import { endOfMonth } from "date-fns";
import { useRef } from "react";

export function JusticeTableHeader({
	setIsEditSettingsDialogOpen,
	setSettings,
	loggedUserLatestRole,
}: UseJusticeOverviewReturn) {
	const rolesCheckboxRefs: Record<UserRole, React.RefObject<HTMLInputElement>> = {
		[UserRole.SQUAD]: useRef<HTMLInputElement>(null),
		[UserRole.OFFICER]: useRef<HTMLInputElement>(null),
		[UserRole.COMMANDER]: useRef<HTMLInputElement>(null),
		[UserRole.EXEMPT]: useRef<HTMLInputElement>(null),
	};
	
	return (
		<div className="flex flex-row">
			<button onClick={() => {
				setIsEditSettingsDialogOpen(true);
			}}
			>
				הגדרות
			</button>
			<div className="group relative">
				<button className="rounded bg-blue-600 px-4 py-2 text-white">Hover me</button>
  
				<div className="absolute left-1/2 top-full mt-2 hidden w-max -translate-x-1/2 rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
					Tooltip text here even more text
    
					<div className="absolute bottom-full left-1/2 size-0 -translate-x-1/2 border-x-4 border-b-4 border-x-transparent border-b-black"></div>
				</div>
			</div>
			<UserRolesSelector
				rolesCheckboxRefs={rolesCheckboxRefs}
				defaultCheckedRole={loggedUserLatestRole}
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
		</div>
	);
};
