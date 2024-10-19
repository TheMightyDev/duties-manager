import clsx from "clsx";
import React from "react";

interface ExpandViewInfoBoxProps {
	value: number | string;
	title: string;
}

export const ExpandViewInfoBox: React.FC<ExpandViewInfoBoxProps> = ({
	value,
	title,
}) => {
	return (
		<div className={clsx(
			"flex flex-col items-center text-center",
			value === 0 && "text-slate-500"
		)}
		>
			<span className="text-lg leading-5">{value}</span>
			<p>{title}</p>
		</div>
	);
};
