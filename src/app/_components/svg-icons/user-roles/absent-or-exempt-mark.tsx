import { HealthSvgIcon } from "@/app/_components/svg-icons/health-svg-icon";
import { PathLocationSvgIcon } from "@/app/_components/svg-icons/path-location-svg-icon";
import { PeriodStatus } from "@prisma/client";

interface AbsentOrExemptMarkProps {
	periodStatus: PeriodStatus;
	isLoggedUserAdmin: boolean;
}

export function AbsentOrExemptMark({
	periodStatus,
	isLoggedUserAdmin,
}: AbsentOrExemptMarkProps) {
	const eligibleToKnowTemporarilyExempt = periodStatus === PeriodStatus.TEMPORARILY_EXEMPT && isLoggedUserAdmin;
	
	return (
		<div className="group/role-mark relative inline-block">
			<div className={"m-auto flex size-7 items-center justify-center rounded-xl bg-red-500 text-white"}>
				{
					eligibleToKnowTemporarilyExempt
						? <HealthSvgIcon className="size-5 fill-white stroke-white"/>
						: <PathLocationSvgIcon className="size-5 fill-white"/>
				}
				
			</div>
			<div
				role="tooltip"
				className="absolute left-1/2 top-full z-10 mt-2 hidden w-max -translate-x-1/2 rounded bg-slate-500 px-2 py-1 text-xs text-white group-hover/role-mark:block"
			>
				{
					eligibleToKnowTemporarilyExempt
						? "פטור.ה זמנית"
						: "נעדר.ת זמנית"
				}
				<div className="absolute bottom-full left-1/2 size-0 -translate-x-1/2 border-x-4 border-b-4 border-x-transparent border-b-slate-500"></div>
			</div>
		</div>
	);
};
