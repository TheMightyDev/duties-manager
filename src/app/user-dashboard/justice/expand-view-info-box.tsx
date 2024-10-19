import clsx from "clsx";

interface ExpandViewInfoBoxProps {
	value: number | string;
	title: string;
}

export function ExpandViewInfoBox({
	value,
	title,
}: ExpandViewInfoBoxProps) {
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
