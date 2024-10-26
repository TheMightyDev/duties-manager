import { type UserJustice } from "@/app/_types/justice/user-justice";
import { ExpandViewInfoBox } from "@/app/user-dashboard/justice/mobile/expand-view-info-box";

interface JusticeTableMobileExpandProps {
	userJustice: UserJustice;
}

export function JusticeTableMobileExpand({ userJustice }: JusticeTableMobileExpandProps) {
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
