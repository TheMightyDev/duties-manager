"use client";

import { initialDutiesSelectOptions } from "@/app/user-dashboard/duties/list-view/const";
import { type DutiesSelectOptions } from "@/types/duties/duties-select-options-schema";
import { type Duty } from "@prisma/client";
import { useState } from "react";

interface DutiesListViewPageContentsProps {
	initialDuties: Duty[];
	getDuties: (options: DutiesSelectOptions) => Promise<Duty[]>;
}

export function DutiesListViewPageContents(props: DutiesListViewPageContentsProps) {
	const [ viewOptions, setViewOptions ] = useState<DutiesSelectOptions>({
		...initialDutiesSelectOptions,
	});
	const [ duties, setDuties ] = useState<Duty[]>(props.initialDuties);
	
	// useEffect(() => {
	// 	props.getDuties(viewOptions)
	// 		.then((obtainedDuties) => {
	// 			setDuties(obtainedDuties);
	// 		});
	// }, [ viewOptions ]);
	
	return (
		<>
			<pre dir="ltr">
				{JSON.stringify(duties, null, 2)}
			</pre>
		</>
	);
};
