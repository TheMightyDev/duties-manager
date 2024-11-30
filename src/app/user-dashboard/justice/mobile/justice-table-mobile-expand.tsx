import { Button } from "@/app/_components/ui/button";
import { ExpandViewInfoBox } from "@/app/user-dashboard/justice/mobile/expand-view-info-box";
import { type UserJustice } from "@/types/justice/user-justice";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

interface JusticeTableMobileExpandProps {
	userJustice: UserJustice;
}

export function JusticeTableMobileExpand({ userJustice }: JusticeTableMobileExpandProps) {
	const {
		monthsInRole,
		weekdaysGuardingCount,
		weekendsGuardingCount,
		otherDutiesScoreSum,
		userId,
		role,
	} = userJustice;
	
	return (
		<div className="flex flex-row justify-center gap-2 pt-1">
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
			
			<Link href={`/user-dashboard/profile/${userId}/${role}`}>
				<Button>
					<ExternalLinkIcon />
				</Button>
			</Link>
		</div>
	);
};
