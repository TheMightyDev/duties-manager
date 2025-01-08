"use client";

import { initialDutiesSelectOptions } from "@/app/user-dashboard/duties/list-view/const";
import { DutiesListViewHeader } from "@/app/user-dashboard/duties/list-view/duties-list-view-header";
import { DutyCard } from "@/app/user-dashboard/duties/list-view/duty-card/duty-card";
import { type DutyWithAssignments } from "@/server/api/types/duty-with-assignments";
import { type DutiesSelectOptions } from "@/types/duties/duties-select-options-schema";
import { useState } from "react";

interface DutiesListViewPageContentsProps {
	initialDuties: DutyWithAssignments[];
	getDuties: (options: DutiesSelectOptions) => Promise<DutyWithAssignments[]>;
}

export function DutiesListViewPageContents(props: DutiesListViewPageContentsProps) {
	const [ viewOptions, setViewOptions ] = useState<DutiesSelectOptions>({
		...initialDutiesSelectOptions,
	});
	const [ duties, setDuties ] = useState<DutyWithAssignments[]>(props.initialDuties);
		
	function changeViewOptions(nextOptions: DutiesSelectOptions) {
		setViewOptions(nextOptions);
		
		props.getDuties(nextOptions)
			.then((obtainedDuties) => {
				setDuties(obtainedDuties);
			});
	}
	
	return (
		<>
			<DutiesListViewHeader
				viewOptions={viewOptions}
				changeViewOptions={changeViewOptions}
			/>
			<div className="flex flex-row flex-wrap">
				{duties.map((duty) => (
					<DutyCard
						duty={duty}
						key={duty.id}
					/>
				))}
			</div>
		</>
	);
};
