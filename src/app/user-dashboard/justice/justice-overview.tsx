"use client";

import { JusticeTableDesktop } from "@/app/user-dashboard/justice/desktop/justice-table-desktop";
import { JusticeTableHeader } from "@/app/user-dashboard/justice/desktop/justice-table-header";
import { EditSettingsDialog } from "@/app/user-dashboard/justice/edit-settings-dialog/edit-settings-dialog";
import { JusticeTableMobile } from "@/app/user-dashboard/justice/mobile/justice-table-mobile";
import { JusticeTableMobileFabs } from "@/app/user-dashboard/justice/mobile/justice-table-mobile-fabs";
import { type FetchUsersJusticeFunc } from "@/app/user-dashboard/justice/types";
import { useJusticeOverview } from "@/app/user-dashboard/justice/use-justice-overview";
import { type UserRole } from "@prisma/client";

interface JusticeOverviewProps {
	fetchUsersJustice: FetchUsersJusticeFunc;
	loggedUserLatestRole?: UserRole;
	isLoggedUserAdmin: boolean;
}

export function JusticeOverview({
	fetchUsersJustice,
	loggedUserLatestRole,
	isLoggedUserAdmin,
}: JusticeOverviewProps) {
	const params = useJusticeOverview({
		fetchUsersJustice,
		loggedUserLatestRole,
	});
	
	return (
		<>
			<div className="hidden sm:block">
				<JusticeTableHeader {...params} />
				<JusticeTableDesktop
					{...params}
					isLoggedUserAdmin={isLoggedUserAdmin}
				/>
			</div>
			<div className="block sm:hidden">
				<JusticeTableMobile
					{...params}
					isLoggedUserAdmin={isLoggedUserAdmin}
				/>
				<JusticeTableMobileFabs {...params} />
			</div>
			<EditSettingsDialog
				settingsRef={params.settingsRef}
				isOpen={params.isEditSettingsDialogOpen}
				closeDialog={() => {
					params.setIsEditSettingsDialogOpen(false);
				}}
				applyChanges={params.setSettings}
			/>
		</>
	);
};
