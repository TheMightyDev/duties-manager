import { FloatingActionButton } from "@/app/_components/floating-action-button/floating-action-button";
import { type Dispatch, type SetStateAction } from "react";

interface JusticeTableMobileFabsProps {
	setIsEditSettingsDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export function JusticeTableMobileFabs({ setIsEditSettingsDialogOpen }: JusticeTableMobileFabsProps) {
	return (
		<>
			<FloatingActionButton
				level={1}
				handleClick={() => {
					setIsEditSettingsDialogOpen(true);
				}}
			>
				P
			</FloatingActionButton>
			<FloatingActionButton
				level={2}
				className="bg-blue-500"
				handleClick={() => {
					alert("wakaaaa");
				}}
			>
				S
			</FloatingActionButton>
		</>
	);
};
