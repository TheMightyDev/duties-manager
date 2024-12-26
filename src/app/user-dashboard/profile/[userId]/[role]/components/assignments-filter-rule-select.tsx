"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select";
import { getTextDirection } from "@/app/_utils/get-text-direction";
import { DutyGroupKind } from "@/types/duties/duty-group-kind";
import { DirectionProvider } from "@radix-ui/react-direction";
import { useLocale, useTranslations } from "next-intl";

interface DutyGroupKindSelectProps {
	selectedGroupKind: DutyGroupKind;
	handleGroupKindChange: (nextFilterRule: DutyGroupKind) => void;
}

export function DutyGroupKindSelect(props: DutyGroupKindSelectProps) {
	const t = useTranslations();
	const locale = useLocale();
	const textDir = getTextDirection(locale);
	
	function handleValueChange(nextFilterRule: string) {
		props.handleGroupKindChange(nextFilterRule as DutyGroupKind);
	}
		
	return (
		<>
			<DirectionProvider dir={textDir}>
				<Select
					value={props.selectedGroupKind}
					onValueChange={handleValueChange}
				>
					<SelectTrigger className="m-auto w-52 capitalize lg:absolute">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{
							Object.values(DutyGroupKind).map((filterRule) => {
								return (
									<SelectItem
										value={filterRule}
										key={filterRule}
										className="capitalize"
									>
										{t(`DutyGroupKind.${filterRule}`)}
									</SelectItem>
								);
							})
						}
					</SelectContent>
				</Select>
			</DirectionProvider>
		</>
	);
};
