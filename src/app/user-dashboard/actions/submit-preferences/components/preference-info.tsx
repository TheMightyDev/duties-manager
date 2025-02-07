import { TrashSvgIcon } from "@/app/_components/svg-icons/ui/trash-svg-icon";
import { type Preference } from "@prisma/client";

interface PreferenceInfoProps {
	preference: Preference;
	handleClose: () => void;
	handleDeletePreference: () => void;
}

export function PreferenceInfo(props: PreferenceInfoProps) {
	const { preference } = props;

	return (
		<>
			<div>
				<button
					onClick={() => {
						props.handleDeletePreference();
						props.handleClose();
					}}
				>
					<TrashSvgIcon className="size-8 stroke-black" />
				</button>
			</div>
			{preference.id}!{preference.description}
		</>
	);
}
