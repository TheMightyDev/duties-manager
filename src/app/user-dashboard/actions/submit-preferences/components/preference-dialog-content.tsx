import { PenLineSvgIcon } from "@/app/_components/svg-icons/ui/pen-line-svg-icon";
import { TrashSvgIcon } from "@/app/_components/svg-icons/ui/trash-svg-icon";
import { PreferenceForm } from "@/app/user-dashboard/actions/submit-preferences/components/preference-form";
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
		<>
			<button onClick={props.closeDialog}>
				<X />
			</button>
			<button onClick={deletePreference}>
				<TrashSvgIcon className="size-5 stroke-black" />
			</button>
			<button onClick={toggleEditMode}>
				<PenLineSvgIcon className="size-5 stroke-black" />
			</button>
			{mode === PreferenceDialogContentMode.VIEW && (
				<div dir="ltr">{JSON.stringify(props.preference, null, 2)}</div>
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
		</>
	);
}
