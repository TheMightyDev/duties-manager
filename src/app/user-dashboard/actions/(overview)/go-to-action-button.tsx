import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link, { type LinkProps } from "next/link";
import React from "react";

/** Taken from Next.js `<Link>` type definition */
interface GoToActionButtonProps extends LinkProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
	icon: React.ReactNode;
	additionalMark?: "new" | "soon";
};

export function GoToActionButton(props: GoToActionButtonProps) {
	const {
		icon,
		className,
		children,
		additionalMark,
		...otherProps
	} = props;
	
	const t = useTranslations();
	
	return (
		<Link
			className={cn(
				"bg-blue-500 relative w-72 rounded-lg h-16 text-white flex flex-row items-center font-bold text-xl hover:scale-105 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600",
				className
			)}
			{...otherProps}
		>
			{icon}
			<p>
				{children}
			</p>
			{
				additionalMark &&
				<span className="absolute end-1 top-2 -rotate-12 rounded-full bg-white/80 px-2 py-0.5 text-blue-500">
					{t(`Actions.${additionalMark}`)}
				</span>
			}
			
		</Link>
	);
};
