import clsx from "clsx";
import React from "react";

interface AcceptCloseDialogProps {
	isOpen: boolean;
	actionButtonText: string;
	cancelButtonText: string;
	children?: React.ReactNode;
}

export const AcceptCloseDialog: React.FC<AcceptCloseDialogProps> = ({
	isOpen,
	actionButtonText,
	cancelButtonText,
	children,
}) => {
	return (
		<>
			<div
				className={
					clsx(
						"fixed inset-0 z-20 m-auto bg-black/45",
						isOpen ? "visible opacity-100" : "invisible opacity-0"
					)
				}
				style={{
					transition: `opacity 250ms ${isOpen ? "" : ", visibility 250ms"}`,
				}}
			>
			
			</div>
			<div
				className={
					clsx(
						"fixed inset-0 z-30 m-auto size-44 rounded-lg bg-white",
						isOpen ? "visible opacity-100" : "invisible opacity-0"

					)
				}
				style={{
					transition: `opacity 250ms ${isOpen ? "" : ", visibility 250ms"}`,
				}}
			>
				{children}
			</div>
		</>
	);
};
