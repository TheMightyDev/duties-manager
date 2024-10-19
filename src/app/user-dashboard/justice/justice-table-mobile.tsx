import { JusticeTableMobileExpand } from "@/app/user-dashboard/justice/justice-table-mobile-expand";
import { type UserJustice } from "@/server/api/types/user-justice";
import React from "react";

interface JusticeTableMobileProps {
	usersJusticeSorted: UserJustice[];
}

export const JusticeTableMobile: React.FC<JusticeTableMobileProps> = ({ usersJusticeSorted }) => {
	return (
		<>
			<div>
				{
					usersJusticeSorted.map((userJustice) => (
						<details
							className="odd:bg-slate-200 even:bg-slate-300"
							key={userJustice.userId}
						>
							<summary className="flex h-10 items-center bg-black/10 px-2 text-lg">
								<div className="w-2/5 flex-1">
									{userJustice.userFullName}
								</div>
								<div className="flex-1 text-start">
									{userJustice.weightedScore.toFixed(2)}
								</div>
								<button>
									<svg
										className="-mr-1 size-4 fill-current opacity-75 transition-transform"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
									><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"/></svg>
								</button>
							</summary>
							<JusticeTableMobileExpand userJustice={userJustice} />
						</details>
					))
				}
			</div>
			
		</>
	);
};
