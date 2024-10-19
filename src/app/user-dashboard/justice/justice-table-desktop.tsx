import { type UserJustice } from "@/server/api/types/user-justice";
import React from "react";

interface JusticeTableDesktopProps {
	usersJusticeSorted: UserJustice[];
}

export const JusticeTableDesktop: React.FC<JusticeTableDesktopProps> = ({ usersJusticeSorted }) => {
	return (
		<>
			<table>
				<thead>
					<tr>
						<th>שם</th>
						<th>ניקוד משוקלל</th>
						<th>מס' החודשים ביחידה</th>
						<th>שמירות בימי חול</th>
						<th>שמירות בסופ"ש</th>
						<th>ניקוד תורנויות נוספות</th>
					</tr>
				</thead>
				<tbody>
					{
						usersJusticeSorted.map(({
							userId,
							userFullName,
							weightedScore,
							monthsInRole,
							weekdaysGuardingCount,
							weekendsGuardingCount,
							otherDutiesScoreSum,
						}) => (
							<tr key={userId}>
								<th>{userFullName}</th>
								<th>{weightedScore}</th>
								<td>{monthsInRole}</td>
								<td>{weekdaysGuardingCount}</td>
								<td>{weekendsGuardingCount}</td>
								<td>{otherDutiesScoreSum}</td>
							</tr>
						))
					}
				</tbody>
			</table>
		</>
	);
};
