import clsx from "clsx";
import React from "react";

export interface FloatingDialogData {
	isShown: boolean;
	widthPx: number;
	xOffsetPx: number;
	yOffsetPx: number;
	title: string;
}

interface FloatingDialogProps extends FloatingDialogData {
	children?: React.ReactNode;
	setIsShown: (nextIsShown: boolean) => void;
}

export const FloatingDialog: React.FC<FloatingDialogProps> = ({
	isShown,
	widthPx,
	xOffsetPx,
	yOffsetPx,
	title,
	children,
	
	setIsShown,
}) => {
	const closeDialog = () => {
		setIsShown(false);
	};

	const isOnMobile = document.body.clientWidth < 700;

	return (
		<div
			className={
				clsx(
					"fixed left-0 top-0 z-10 bg-white shadow-xl shadow-black/40 md:rounded-xl",
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
			<header className="flex h-10 w-full justify-between bg-blue-200 md:rounded-t-xl">
				<h3 className="text-xl">
					{title}
				</h3>
				<button
					className="p-2 text-xl"
					onClick={closeDialog}
				>X</button>
			</header>
			<div className="p-1">
				{children}
			</div>
		</div>
	);
};
