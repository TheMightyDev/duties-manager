import { type SvgIconProps } from "@/app/_components/svg-icons/common-svg-icon-props";
import { cn } from "@/lib/utils";
import React from "react";

interface IconButtonProps extends React.ComponentProps<"button"> {
	icon: (props: SvgIconProps) => React.ReactNode;
	iconClassName?: string;
}

export function IconButton({
	icon,
	iconClassName,
	className,
	...props
}: IconButtonProps) {
	const Icon = icon;

	return (
		<button className={cn("p-1 rounded-full hover:bg-slate-200")} {...props}>
			<Icon className={cn("size-5 stroke-black", iconClassName)} />
		</button>
	);
}
