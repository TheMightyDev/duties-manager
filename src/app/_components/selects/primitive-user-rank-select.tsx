"use client";

import { type SharedSelectProps } from "@/app/_components/selects/shared-select-props";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/ui/select";
import { UserRank } from "@prisma/client";
import { DirectionProvider } from "@radix-ui/react-direction";
import { useTranslations } from "next-intl";

type PrimitiveUserRankSelectProps = SharedSelectProps<UserRank>;

export function PrimitiveUserRankSelect(props: PrimitiveUserRankSelectProps) {
	const t = useTranslations();

	function handleValueChange(nextValue: string) {
		props.handleValueChange(nextValue as UserRank);
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
						{(props.availableValues ?? Object.values(UserRank)).map((rank) => {
							return (
								<SelectItem value={rank} key={rank}>
									{t(`UserRank.${rank}`)}
								</SelectItem>
							);
						})}
					</SelectContent>
				</Select>
			</DirectionProvider>
		</>
	);
}
