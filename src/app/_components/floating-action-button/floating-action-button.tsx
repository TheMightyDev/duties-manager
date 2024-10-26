import { cn } from "@/app/_utils/cn";
import { type ReactNode } from "react";

interface FloatingActionButtonProps {
	/** Affects the FAB size and position, to support 2 FABs next to each other:
	 * - `1` - large and at inline end (default)
	 * - `2` - smaller than `1`, at inline end but above `1`
	 */
	level?: 1 | 2;
	className?: string;
	handleClick: () => void;
	children?: ReactNode;
}

export function FloatingActionButton({
	level = 1,
	className,
	handleClick,
	children,
}: FloatingActionButtonProps) {
	return (
		<button
			onClick={handleClick}
			className={cn(
				"fixed end-4 z-10 rounded-2xl bg-purple-400 ",
				level === 1 ? "bottom-20 size-16 shadow-xl" : "bottom-[9.5rem] size-14 shadow-md",
				className
			)}
		>
			{children}
		</button>
	);
};
