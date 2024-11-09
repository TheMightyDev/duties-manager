import { CheckmarkSvgIcon } from "@/app/_components/svg-icons/checkmark-svg-icon";
import { PathLocationSvgIcon } from "@/app/_components/svg-icons/path-location-svg-icon";
import { cn } from "@/app/_utils/cn";
import { PeriodStatus } from "@prisma/client";
import React from "react";

interface PeriodStatusInfoBoxProps {
	className: string;
	status: PeriodStatus;
}

const statusIcons: Record<PeriodStatus, React.ReactNode> = {
	[PeriodStatus.FULFILLS_ROLE]: <CheckmarkSvgIcon className="m-auto size-10 fill-white" />,
	[PeriodStatus.TEMPORARILY_ABSENT]: <PathLocationSvgIcon className="m-auto size-10 fill-white" />,
	[PeriodStatus.TEMPORARILY_EXEMPT]: <CheckmarkSvgIcon />,
};

const statusDescriptions: Record<PeriodStatus, string> = {
	[PeriodStatus.FULFILLS_ROLE]: "נוכח.ת בתפקיד",
	[PeriodStatus.TEMPORARILY_ABSENT]: "לא נוכח.ת",
	[PeriodStatus.TEMPORARILY_EXEMPT]: "לא נוכח.ת",
};

export function PeriodStatusInfoBox({ className, status }: PeriodStatusInfoBoxProps) {
	return (
		<div className={cn(className, "bg-green-500 text-white hover:bg-green-600")}>
			<span className="text-4xl">{statusIcons[status]}</span>
			<span className="font-bold">
				{statusDescriptions[status]}
			</span>
		</div>
	);
};
