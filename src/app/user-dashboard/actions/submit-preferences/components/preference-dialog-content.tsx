import { PenLineSvgIcon } from "@/app/_components/svg-icons/ui/pen-line-svg-icon";
import { TrashSvgIcon } from "@/app/_components/svg-icons/ui/trash-svg-icon";
import { IconButton } from "@/app/_components/ui/icon-button";
import { PreferenceForm } from "@/app/user-dashboard/actions/submit-preferences/components/preference-form";
import { PreferenceInfo } from "@/app/user-dashboard/actions/submit-preferences/components/preference-info";
import {
	type GetPreferenceParams,
	type PreferenceOperations,
} from "@/app/user-dashboard/types";
import { type Preference } from "@prisma/client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface PreferenceDialogContentProps extends PreferenceOperations<void> {
	preference: Preference;
	getPreference: (params: GetPreferenceParams) => Preference | undefined;
	recalculateFloatingDialogPosition: () => void;
	closeDialog: () => void;
}

enum PreferenceDialogContentMode {
	VIEW,
	EDIT,
}

/** The contents of the floating dialog when an existing preference is selected (either viewed or edited)
 * or a new preference is created
 */
export function PreferenceDialogContent(props: PreferenceDialogContentProps) {
	const [mode, setMode] = useState(PreferenceDialogContentMode.VIEW);

	const deletePreference = () => {
		props.deletePreference({
			id: props.preference.id,
		});

		props.closeDialog();
	};

	const toggleEditMode = () => {
		if (mode === PreferenceDialogContentMode.EDIT) {
			setMode(PreferenceDialogContentMode.VIEW);
			props.recalculateFloatingDialogPosition();
		} else {
			setMode(PreferenceDialogContentMode.EDIT);
			props.recalculateFloatingDialogPosition();
		}
	};

	useEffect(() => {
		setMode(PreferenceDialogContentMode.VIEW);
	}, [props.preference]);

	return (
		<div className="p-2">
			<div className="flex flex-row justify-end gap-1">
				<IconButton
					onClick={toggleEditMode}
					icon={PenLineSvgIcon}
					iconClassName="stroke-event-foreground"
				/>
				<IconButton
					onClick={deletePreference}
					icon={TrashSvgIcon}
					iconClassName="stroke-event-foreground"
				/>
				<IconButton
					onClick={props.closeDialog}
					icon={X}
					iconClassName="stroke-event-foreground"
				/>
			</div>
			{mode === PreferenceDialogContentMode.VIEW && (
				<PreferenceInfo preference={props.preference} />
			)}
			{mode === PreferenceDialogContentMode.EDIT && (
				<PreferenceForm
					initialPreferenceData={props.preference}
					getPreference={props.getPreference}
					handleCancel={() => {
						toggleEditMode();
					}}
					handleSubmit={(submittedData) => {
						props.updatePreference({
							id: props.preference.id,
							...submittedData,
						});
						props.closeDialog();
					}}
				/>
			)}
		</div>
	);
}
