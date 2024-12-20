import { ArchiveSvgIcon } from "@/app/_components/svg-icons/archive-svg-icon";
import { CheckmarkSvgIcon } from "@/app/_components/svg-icons/checkmark-svg-icon";
import { HealthSvgIcon } from "@/app/_components/svg-icons/health-svg-icon";
import { PathLocationSvgIcon } from "@/app/_components/svg-icons/path-location-svg-icon";
import { cn } from "@/app/_utils/cn";
import { auth } from "@/server/auth";
import { PeriodStatus } from "@prisma/client";

interface PeriodStatusInfoBoxProps {
	status: PeriodStatus;
	isEarlyRole: boolean;
}

function getIcon({ status, isEarlyRole, isLoggedUserAdmin }: {
	status: PeriodStatus;
	isEarlyRole: boolean;
	isLoggedUserAdmin: boolean;
}) {
	const className = "size-10 fill-white m-auto";
	const heartClassName = "size-10 fill-white stroke-white m-auto";
	
	if (isEarlyRole) {
		return <ArchiveSvgIcon className={className} />;
	}
	
	if (status === PeriodStatus.FULFILLS_ROLE) {
		return <CheckmarkSvgIcon className={className} />;
	} else {
		if (status === PeriodStatus.TEMPORARILY_EXEMPT && isLoggedUserAdmin) {
			return <HealthSvgIcon className={heartClassName} />;
		} else {
			return <PathLocationSvgIcon className={className} />;
		}
	}
}

function getDescription({ status, isEarlyRole, isLoggedUserAdmin }: {
	status: PeriodStatus;
	isEarlyRole: boolean;
	isLoggedUserAdmin: boolean;
}) {
	if (isEarlyRole) {
		return "תפקיד בעבר";
	}
	if (status === PeriodStatus.FULFILLS_ROLE) {
		return "נוכח.ת בתפקיד";
	} else {
		if (!isLoggedUserAdmin) {
			return "לא נוכח.ת כעת";
		}

		return status === PeriodStatus.TEMPORARILY_EXEMPT
			? "פטור.ה זמנית"
			: "נעדר.ת זמנית";
	}
}

export async function PeriodStatusInfoBox(props: PeriodStatusInfoBoxProps) {
	const session = await auth();
	const isLoggedUserAdmin = session?.user.isAdmin ?? false;
	
	const className = props.isEarlyRole
		? "bg-slate-500 hover:bg-slate-600"
		: (
			props.status === PeriodStatus.FULFILLS_ROLE
				? "bg-green-500 hover:bg-green-600"
				: "bg-red-500 hover:bg-red-600"
		);
	
	return (
		<div className={cn("flex flex-col rounded-xl bg-slate-200 p-3 sm:p-4 hover:bg-slate-300 flex-1 text-center", className, "text-white")}>
			<span className="text-4xl">
				{ getIcon({
					status: props.status,
					isEarlyRole: props.isEarlyRole,
					isLoggedUserAdmin,
				}) }
			</span>
			<span className="font-bold">
				{ getDescription({
					status: props.status,
					isEarlyRole: props.isEarlyRole,
					isLoggedUserAdmin,
				}) }
			</span>
		</div>
	);
};
