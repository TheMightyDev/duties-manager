"use client";

import { cn } from "@/app/_utils/cn";
import clsx from "clsx";
import { useState } from "react";

interface AccordionProps {
	isOpenByDefault?: boolean;
	disabled?: boolean;
	title: string;
	titleClassName?: string;
	children?: React.ReactNode;
}

export function Accordion({
	title,
	children,
	isOpenByDefault = false,
	titleClassName,
	disabled = false,
}: AccordionProps) {
	const [ isOpen, setIsOpen ] = useState(isOpenByDefault);
	
	function toggleIsOpen() {
		setIsOpen((prev) => !prev);
	}
	
	return (
		<div>
			<div
				onClick={toggleIsOpen}
				className={
					cn("rounded-full cursor-pointer border-2 border-slate-400", titleClassName)
				}
			>{title}</div>
			<div className={clsx(
				"bg-red-300",
				isOpen ? "block" : "hidden"
			)}
			>
				{children}
			</div>
		</div>
	);
};
