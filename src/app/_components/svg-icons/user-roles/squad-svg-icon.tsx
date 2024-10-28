import { type SvgIconProps } from "@/app/_components/svg-icons/common-svg-icon-props";
import { cn } from "@/app/_utils/cn";

export function SquadSvgIcon({ className }: SvgIconProps) {
	return (
		<svg
			className={cn("inline fill-current", className)}
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g
				id="SVGRepo_bgCarrier"
				stroke-width="0"
			/>
			<g
				id="SVGRepo_tracerCarrier"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<g id="SVGRepo_iconCarrier"><path d="M4.153,18.452l8.382,3.864a4.973,4.973,0,0,0,5.19-.087c.263-.166.056-.013,4.552-5.546A1.98,1.98,0,0,0,22.994,15c-.146-2.01-2.4-1.894-3.994-2.7V10A9,9,0,0,0,1,10v3A6.313,6.313,0,0,0,4.153,18.452Zm12.372,2.165a2.98,2.98,0,0,1-3.01-.045q-.048-.027-.1-.051c-7.709-3.724-8.327-3.474-9.4-4.744,4.114,1.986,11.029,1.647,14.28-1.6l2.692.975C20.785,15.3,21.118,14.956,16.525,20.617ZM17,10v2.646c-2.273,2.513-7.72,2.847-11,1.781V12.25c0-3.837,1.333-8.5,5.067-9.16A7.005,7.005,0,0,1,17,10ZM6.179,4.142A14.779,14.779,0,0,0,4,12.25v1.233a5.236,5.236,0,0,1-1-.836V10A7,7,0,0,1,6.179,4.142Z"></path></g>
		</svg>
	);
};
