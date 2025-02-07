import { PreferenceForm } from "@/app/user-dashboard/actions/submit-preferences/components/preference-form";
import {
	EventKind,
	type EventTaggedUnion,
} from "@/app/user-dashboard/actions/submit-preferences/types";

interface PreferenceDialogContentProps {
	/** The selected event, the expected kind is either `PREFERENCE` or `NEW_PREFERENCE` */
	selectedEvent: EventTaggedUnion;
}

/** The contents of the floating dialog when an existing preference is selected (either viewed or edited)
 * or a new preference is created
 */
export function PreferenceDialogContent(props: PreferenceDialogContentProps) {
	return (
		<>
			{props.selectedEvent.kind === EventKind.NEW_PREFERENCE && (
				<PreferenceForm />
			)}
		</>
	);
}
