"use client";

import { cn } from "@/lib/utils";
import React from "react";

export interface FloatingDialogData {
	isShown: boolean;
	widthPx: number;
	xOffsetPx: number;
	yOffsetPx: number;
	className?: string;
}

interface FloatingDialogProps extends FloatingDialogData {
	containerRef: React.RefObject<HTMLDivElement>;
	children?: React.ReactNode;
}

export function FloatingDialog({
	isShown,
	widthPx,
	xOffsetPx,
	yOffsetPx,
	children,
	className,
	containerRef,
}: FloatingDialogProps) {
	const isOnMobile = document.documentElement.clientWidth < 700;

	return (
		<div
			ref={containerRef}
			className={
				cn(
					"fixed left-0 top-0 z-10 bg-white shadow-2xl shadow-black/50  md:rounded-xl",
					isShown ? "visible opacity-100" : "invisible opacity-0",
					className
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
