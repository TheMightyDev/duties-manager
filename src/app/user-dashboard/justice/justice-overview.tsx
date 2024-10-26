"use client";

import { JusticeTableDesktop } from "@/app/user-dashboard/justice/desktop/justice-table-desktop";
import { JusticeTableMobile } from "@/app/user-dashboard/justice/mobile/justice-table-mobile";
import { type FetchUsersJusticeFunc } from "@/app/user-dashboard/justice/types";
import { useJusticeOverview } from "@/app/user-dashboard/justice/use-justice-overview";

interface JusticeOverviewProps {
	fetchUsersJustice: FetchUsersJusticeFunc;
}

export function JusticeOverview({ fetchUsersJustice }: JusticeOverviewProps) {
	const params = useJusticeOverview({
		fetchUsersJustice,
	});
	
	return (
		<>
			<div className="hidden md:block">
				<JusticeTableDesktop {...params} />
			</div>
			<div className="block md:hidden">
				<JusticeTableMobile {...params} />
			</div>
		</>
	);
};
