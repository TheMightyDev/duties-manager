import { type Dispatch, type SetStateAction } from "react";

interface JusticeTableHeaderProps {
	setIsEditSettingsDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export function JusticeTableHeader({ setIsEditSettingsDialogOpen }: JusticeTableHeaderProps) {
	return (
		<>
			<button onClick={() => {
				setIsEditSettingsDialogOpen(true);
			}}
			>
				הגדרות
			</button>
		</>
	);
};
