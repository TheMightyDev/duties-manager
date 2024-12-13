import { cn } from "@/lib/utils";
import React from "react";

interface DialogProps {
	isOpen: boolean;
	className?: string;
	backdropClassName?: string;
	children?: React.ReactNode;
}

/** A general purpose dialog that covers entire screen
 * on mobile and appears in the center on desktops
 */
export function Dialog({
	isOpen,
	className,
	backdropClassName,
	children,
}: DialogProps) {
	return (
		<div
			className={cn(
				"fixed inset-0 z-20 flex h-screen w-screen items-center justify-center bg-black/50",
				isOpen ? "visible opacity-100" : "invisible opacity-0",
				backdropClassName
			)}
			style={{
				transition: `opacity 350ms, transform 350ms ${isOpen ? "" : ", visibility 350ms"}`,
			}}
		>
			<div
				className={cn(
					"absolute inset-auto m-auto h-screen w-screen bg-white shadow-2xl shadow-black/50 md:h-fit md:min-h-96 md:w-96 md:rounded-xl",
					isOpen ? "visible opacity-100" : "invisible opacity-0",
					className
				)}
				style={{
					transition: `opacity 350ms, transform 350ms ${isOpen ? "" : ", visibility 350ms"}`,
				}}
			>
				{children}
			</div>
		</div>
	);
};
