import { InfoCircleSvgIcon } from "@/app/_components/svg-icons/ui/info-circle-svg-icon";
import React from "react";

interface ProfileMetricBoxProps {
	title: string;
	value: number | string;
	valueSuffix?: React.ReactNode;
	hasInfoMessage?: boolean;
}

export function ProfileMetricBoxSkeleton(props: ProfileMetricBoxProps) {
	return (
		<div className="flex flex-1 flex-col rounded-xl bg-slate-200 p-3 text-center sm:p-4">
			<span className="text-4xl">{props.value}{props.valueSuffix}</span>
			<span>{props.title}
				{
					props.hasInfoMessage &&
					<span className="ps-1"><InfoCircleSvgIcon className=" inline-block size-6"/></span>
				}
			</span>
		</div>
	);
};
