"use client";

import { JusticeTableDesktop } from "@/app/user-dashboard/justice/desktop/justice-table-desktop";
import { JusticeTableHeader } from "@/app/user-dashboard/justice/desktop/justice-table-header";
import { EditSettingsDialog } from "@/app/user-dashboard/justice/edit-settings-dialog/edit-settings-dialog";
import { JusticeTableMobile } from "@/app/user-dashboard/justice/mobile/justice-table-mobile";
import { JusticeTableMobileFabs } from "@/app/user-dashboard/justice/mobile/justice-table-mobile-fabs";
import { type FetchUsersJusticeFunc } from "@/app/user-dashboard/justice/types";
import { useJusticeOverview } from "@/app/user-dashboard/justice/use-justice-overview";
import { type UserRole } from "@prisma/client";
import { useRef } from "react";

interface JusticeOverviewProps {
	fetchUsersJustice: FetchUsersJusticeFunc;
	loggedUserLatestRole?: UserRole;
}

export function JusticeOverview({
	fetchUsersJustice,
	loggedUserLatestRole,
}: JusticeOverviewProps) {
	const params = useJusticeOverview({
		fetchUsersJustice,
		loggedUserLatestRole,
	});
	
	const someRef = useRef<string>("watch me");
	
	function clickMe() {
		someRef.current = "doesn't";
		console.log("@someRef.current", someRef.current);
	}
	
	return (
		<>
			<div className="hidden md:block">
				<JusticeTableHeader {...params} />
				<JusticeTableDesktop {...params} />
			</div>
			<div className="block md:hidden">
				<JusticeTableMobile {...params} />
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
