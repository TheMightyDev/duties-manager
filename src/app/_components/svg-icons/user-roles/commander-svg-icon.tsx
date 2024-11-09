import { type SvgIconProps } from "@/app/_components/svg-icons/common-svg-icon-props";
import { cn } from "@/app/_utils/cn";

export function CommanderSvgIcon({ className }: SvgIconProps) {
	return (
		<svg
			className={cn("inline fill-current", className)}
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g strokeWidth="0" />
			<g
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<g><path d="M22,12A10,10,0,1,1,12,2a1,1,0,0,1,0,2,8,8,0,1,0,8,8,1,1,0,0,1,2,0ZM12,9a1,1,0,0,0,0-2,5,5,0,1,0,5,5,1,1,0,0,0-2,0,3,3,0,1,1-3-3Zm-.71,3.71a1,1,0,0,0,1.42,0L16.41,9H19a1,1,0,0,0,.71-.29l2-2A1,1,0,0,0,22,5.84a1,1,0,0,0-.54-.73l-1.7-.86-.86-1.7A1,1,0,0,0,18.16,2a1,1,0,0,0-.87.28l-2,2A1,1,0,0,0,15,5V7.59l-3.71,3.7A1,1,0,0,0,11.29,12.71Z"></path></g>
		</svg>
	);
};
