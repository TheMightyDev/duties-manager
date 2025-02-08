import { PenLineSvgIcon } from "@/app/_components/svg-icons/ui/pen-line-svg-icon";
import { TrashSvgIcon } from "@/app/_components/svg-icons/ui/trash-svg-icon";
import { PreferenceForm } from "@/app/user-dashboard/actions/submit-preferences/components/preference-form";
import {
	type GetPreferenceParams,
	type PreferenceOperations,
} from "@/app/user-dashboard/types";
import { type Preference } from "@prisma/client";
import { X } from "lucide-react";
import { useState } from "react";

interface PreferenceDialogContentProps extends PreferenceOperations<void> {
	preference: Preference;
	getPreference: (params: GetPreferenceParams) => Preference | undefined;
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
		setMode((prev) => {
			if (prev !== PreferenceDialogContentMode.EDIT) {
				return PreferenceDialogContentMode.EDIT;
			} else {
				return PreferenceDialogContentMode.VIEW;
			}
		});
	};

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
					userId="ofeks"
					updatePreference={(preference) => {
						props.updatePreference(preference);
						props.closeDialog();
					}}
					getPreference={props.getPreference}
					initialPreferenceData={props.preference}
				/>
			)}
		</>
	);
}
