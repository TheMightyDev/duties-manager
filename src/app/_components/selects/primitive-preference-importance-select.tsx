"use client";

import { type SharedSelectProps } from "@/app/_components/selects/shared-select-props";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/ui/select";
import { PreferenceImportance } from "@prisma/client";
import { DirectionProvider } from "@radix-ui/react-direction";
import { useTranslations } from "next-intl";

type PrimitivePreferenceImportanceSelectProps =
	SharedSelectProps<PreferenceImportance>;

export function PrimitivePreferenceImportanceSelect(
	props: PrimitivePreferenceImportanceSelectProps,
) {
	const t = useTranslations();

	function handleValueChange(nextValue: string) {
		props.handleValueChange(nextValue as PreferenceImportance);
	}

	return (
		<>
			<DirectionProvider dir="rtl">
				<Select
					value={props.currentValue}
					defaultValue={props.defaultValue}
					onValueChange={handleValueChange}
				>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent className="max-h-64">
						{(props.availableValues ?? Object.values(PreferenceImportance)).map(
							(importance) => {
								return (
									<SelectItem value={importance} key={importance}>
										{t(`PreferenceImportance.${importance}`)}
									</SelectItem>
								);
							},
						)}
					</SelectContent>
				</Select>
			</DirectionProvider>
		</>
	);
}
