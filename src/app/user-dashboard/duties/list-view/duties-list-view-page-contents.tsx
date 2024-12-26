"use client";

import { initialDutiesSelectOptions } from "@/app/user-dashboard/duties/list-view/const";
import { DutiesListViewHeader } from "@/app/user-dashboard/duties/list-view/duties-list-view-header";
import { type DutiesSelectOptions } from "@/types/duties/duties-select-options-schema";
import { type Duty } from "@prisma/client";
import { useEffect, useState } from "react";

interface DutiesListViewPageContentsProps {
	initialDuties: Duty[];
	getDuties: (options: DutiesSelectOptions) => Promise<Duty[]>;
}

export function DutiesListViewPageContents(props: DutiesListViewPageContentsProps) {
	const [ viewOptions, setViewOptions ] = useState<DutiesSelectOptions>({
		...initialDutiesSelectOptions,
	});
	const [ duties, setDuties ] = useState<Duty[]>(props.initialDuties);
	
	// This is unnecessary at the component's first render
	// because we obtain the duties from the prop `initialDuties`,
	// but it's useful for every time the view options change.
	useEffect(() => {
		props.getDuties(viewOptions)
			.then((obtainedDuties) => {
				setDuties(obtainedDuties);
			});
	}, [ viewOptions ]);
	
	return (
		<>
			<DutiesListViewHeader
				viewOptions={viewOptions}
				setViewOptions={setViewOptions}
			/>
			<pre dir="ltr">
				{JSON.stringify(duties, null, 2)}
			</pre>
		</>
	);
};
