"use client";

import { type SharedSelectProps } from "@/app/_components/selects/shared-select-props";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/ui/select";
import { PreferenceKind } from "@prisma/client";
import { DirectionProvider } from "@radix-ui/react-direction";
import { useTranslations } from "next-intl";

type PrimitivePreferenceKindSelectProps = SharedSelectProps<PreferenceKind>;

export function PrimitivePreferenceKindSelect(
	props: PrimitivePreferenceKindSelectProps,
) {
	const t = useTranslations();

	function handleValueChange(nextValue: string) {
		props.handleValueChange(nextValue as PreferenceKind);
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
						{(props.availableValues ?? Object.values(PreferenceKind)).map(
							(kind) => {
								return (
									<SelectItem value={kind} key={kind}>
										{kind}
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
