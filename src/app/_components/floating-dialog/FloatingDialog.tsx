import clsx from "clsx";
import React from "react";

export interface FloatingDialogData {
	isShown: boolean;
	widthPx: number;
	xOffsetPx: number;
	yOffsetPx: number;
}

interface FloatingDialogProps extends FloatingDialogData {
	children?: React.ReactNode;
}

export const FloatingDialog: React.FC<FloatingDialogProps> = ({
	isShown,
	widthPx,
	xOffsetPx,
	yOffsetPx,
	children,
}) => {
	const isOnMobile = false;

	return (
		<div
			className={
				clsx(
					"fixed left-0 top-0 z-10 bg-white shadow-2xl shadow-black/50 md:rounded-xl",
					isShown ? "visible opacity-100" : "invisible opacity-0"
				)
			}
			style={{
				width: isOnMobile ? "100vw" : `${widthPx}px`,
				height: isOnMobile ? "100vh" : "fit-content",
				transform: isOnMobile ? undefined : `translate(${xOffsetPx}px, ${yOffsetPx}px)`,
				transition: `opacity 350ms, transform 350ms ${isShown ? "" : ", visibility 350ms"}`,
			}}
		>
			{children}
		</div>
	);
};
