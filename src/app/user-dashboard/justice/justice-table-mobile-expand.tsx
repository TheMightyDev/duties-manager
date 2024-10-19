import { ExpandViewInfoBox } from "@/app/user-dashboard/justice/expand-view-info-box";
import { type UserJustice } from "@/server/api/types/user-justice";
import React from "react";

interface JusticeTableMobileExpandProps {
	userJustice: UserJustice;
}

export const JusticeTableMobileExpand: React.FC<JusticeTableMobileExpandProps> = ({ userJustice }) => {
	const {
		monthsInRole,
		weekdaysGuardingCount,
		weekendsGuardingCount,
		otherDutiesScoreSum,
	} = userJustice;
	
	return (
		<div className="flex flex-row gap-2 pt-1">
			<ExpandViewInfoBox
				value={monthsInRole.toFixed(2)}
				title="חודשים בתפקיד"
			/>
			<ExpandViewInfoBox
				value={weekdaysGuardingCount}
				title="שמירות ביום חול"
			/>
			<ExpandViewInfoBox
				value={weekendsGuardingCount}
				title='שמירות בסופ"ש'
			/>
			<ExpandViewInfoBox
				value={otherDutiesScoreSum}
				title="נק' תורנויות נוספות"
			/>
		</div>
	);
};
