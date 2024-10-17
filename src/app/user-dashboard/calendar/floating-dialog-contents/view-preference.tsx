"use client";

import { FloatingDialogClassicHeader } from "@/app/_components/floating-dialog/helpers/classic-header";
import { type Preference } from "@prisma/client";
import React from "react";

interface ViewPreferenceProps {
	preference: Preference;
	closeDialog: () => void;
}

export const ViewPreference: React.FC<ViewPreferenceProps> = ({
	preference,
	closeDialog,
}) => {
	const {
		description,
		startDate,
		endDate,
		importance,
		reason,
	} = preference;
	
	return (
		<div>
			<FloatingDialogClassicHeader handleClose={closeDialog} />
			<h3 className="text-xl font-bold">
				{description}
			</h3>
			<p>
				{reason} - {importance}
			</p>
			<pre>
				{startDate.toUTCString()}
			</pre>
			<pre>
				{endDate?.toUTCString()}
			</pre>
		</div>
	);
};
