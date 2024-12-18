import { ArchiveSvgIcon } from "@/app/_components/svg-icons/archive-svg-icon";
import { CheckmarkSvgIcon } from "@/app/_components/svg-icons/checkmark-svg-icon";
import { HealthSvgIcon } from "@/app/_components/svg-icons/health-svg-icon";
import { PathLocationSvgIcon } from "@/app/_components/svg-icons/path-location-svg-icon";
import { cn } from "@/app/_utils/cn";
import { auth } from "@/server/auth";
import { PeriodStatus } from "@prisma/client";

interface PeriodStatusInfoBoxProps {
	baseClassName: string;
	status: PeriodStatus;
	isEarlyRole: boolean;
}

function getIcon({ status, isEarlyRole, isAdmin }: {
	status: PeriodStatus;
	isEarlyRole: boolean;
	isAdmin: boolean;
}) {
	const className = "size-10 fill-white m-auto";
	const heartClassName = "size-10 fill-white stroke-white m-auto";
	
	if (isEarlyRole) {
		return <ArchiveSvgIcon className={className} />;
	}
	
	if (status === PeriodStatus.FULFILLS_ROLE) {
		return <CheckmarkSvgIcon className={className} />;
	} else {
		if (!isAdmin || status === PeriodStatus.TEMPORARILY_ABSENT) {
			return <PathLocationSvgIcon className={className} />;
		} else {
			return <HealthSvgIcon className={heartClassName} />;
		}
	}
}

function getDescription({ status, isEarlyRole, isAdmin }: {
	status: PeriodStatus;
	isEarlyRole: boolean;
	isAdmin: boolean;
}) {
	if (isEarlyRole) {
		return "תפקיד בעבר";
	}
	if (status === PeriodStatus.FULFILLS_ROLE) {
		return "נוכח.ת בתפקיד";
	} else {
		if (!isAdmin) {
			return "לא נוכח.ת כעת";
		}

		return status === PeriodStatus.TEMPORARILY_EXEMPT
			? "פטור.ה זמנית"
			: "נעדר.ת זמנית";
	}
}

export async function PeriodStatusInfoBox({ baseClassName, status, isEarlyRole }: PeriodStatusInfoBoxProps) {
	const session = await auth();
	const isAdmin = session?.user.isAdmin ?? false;
	
	const className = isEarlyRole
		? "bg-slate-500 hover:bg-slate-600"
		: (
			status === PeriodStatus.FULFILLS_ROLE
				? "bg-green-500 hover:bg-green-600"
				: "bg-red-500 hover:bg-red-600"
		);
	
	return (
		<div className={cn(baseClassName, className, "text-white")}>
			<span className="text-4xl">
				{ getIcon({
					status,
					isEarlyRole,
					isAdmin,
				}) }
			</span>
			<span className="font-bold">
				{ getDescription({
					status,
					isEarlyRole,
					isAdmin,
				}) }
			</span>
		</div>
	);
};
