import React from "react";

export interface FloatingDialogData {
	isShown: boolean;
	widthPx: number;
	xOffsetPx: number;
	yOffsetPx: number;
}

interface FloatingDialogProps extends FloatingDialogData {
	setIsShown: (nextIsShown: boolean) => void;
}

export const FloatingDialog: React.FC<FloatingDialogProps> = ({
	isShown,
	widthPx,
	xOffsetPx,
	yOffsetPx,
	
	setIsShown,
}) => {
	const closeDialog = () => {
		setIsShown(false);
	};

	return !isShown ? <></> : (
		<div
			className="fixed left-0 top-0 z-10 size-[200px] rounded-xl bg-red-500 shadow-xl"
			style={{
				width: `${widthPx}px`,
				transform: `translate(${xOffsetPx}px, ${yOffsetPx}px)`,
				transition: "transform 400ms",
			}}>
			<header className="w-full rounded-t-xl bg-blue-200">
				סגירה
				<button onClick={closeDialog}>X</button>
			</header>
		</div>
	);
};
