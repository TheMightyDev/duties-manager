"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select";
import { getAllMonthNames } from "@/app/_utils/date-format-utils";
import { DirectionProvider } from "@radix-ui/react-direction";
import { useLocale } from "next-intl";
import { useMemo } from "react";

interface StartMonthSelectProps {
	currentSelectedMonth?: number | null;
	defaultSelectedMonth?: number | null;
	handleMonthChange: (nextMonth: number | null) => void;
	hasNoMonthOption?: boolean;
}

export function StartMonthSelect(props: StartMonthSelectProps) {
	const locale = useLocale();
	const monthNames = useMemo(() => (
		getAllMonthNames({
			locale,
			format: "long",
		})
	), []);
	
	const ALL_YEAR_VALUE = "ALL_YEAR";
	
	function handleValueChange(nextValue: string) {
		props.handleMonthChange(nextValue === ALL_YEAR_VALUE ? null : Number(nextValue));
	}
	
	return (
		<DirectionProvider dir="rtl">
			<Select
				value={props.currentSelectedMonth === null
					? ALL_YEAR_VALUE
					: String(props.currentSelectedMonth)}
				defaultValue={props.defaultSelectedMonth === null
					? ALL_YEAR_VALUE
					: String(props.defaultSelectedMonth)}
				onValueChange={handleValueChange}
			>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent className="max-h-64">
					{
						props.hasNoMonthOption &&
						<SelectItem value={ALL_YEAR_VALUE}>
							כל השנה
						</SelectItem>
					}
					{
						monthNames.map((monthName, monthIndex) => {
							return (
								<SelectItem
									value={String(monthIndex)}
									key={monthIndex}
								>
									{monthName}
								</SelectItem>
							);
						})
					}
				</SelectContent>
			</Select>
		</DirectionProvider>
	);
};
