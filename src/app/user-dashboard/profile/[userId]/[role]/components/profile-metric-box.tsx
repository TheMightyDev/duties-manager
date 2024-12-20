import { InfoCircleSvgIcon } from "@/app/_components/svg-icons/ui/info-circle-svg-icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/_components/ui/popover";
import React from "react";

interface ProfileMetricBoxProps {
	title: string;
	value: number | string;
	valueSuffix?: React.ReactNode;
	infoMessage?: string;
}

export function ProfileMetricBox(props: ProfileMetricBoxProps) {
	return (
		<div className="flex flex-1 flex-col rounded-xl bg-slate-200 p-3 text-center hover:bg-slate-300 sm:p-4">
			<span className="text-4xl">{props.value}{props.valueSuffix}</span>
			<span>{props.title}
				{
					props.infoMessage &&
					<Popover>
						<PopoverTrigger className="ps-1"><InfoCircleSvgIcon className=" inline-block size-6"/></PopoverTrigger>
						<PopoverContent className="select-none bg-white">
							{props.infoMessage}
						</PopoverContent>
					</Popover>
				}
			</span>
		</div>
	);
};
