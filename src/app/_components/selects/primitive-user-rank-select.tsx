"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select";
import { UserRank } from "@prisma/client";
import { DirectionProvider } from "@radix-ui/react-direction";

interface PrimitiveUserRankSelectProps {
	currentSelectedRank?: UserRank;
	defaultSelectedRank?: UserRank;
	handleRankChange: (nextRank: UserRank) => void;
}

export function PrimitiveUserRankSelect(props: PrimitiveUserRankSelectProps) {
	function handleValueChange(nextRank: string) {
		props.handleRankChange(nextRank as UserRank);
	}
	
	return (
		<>
			<DirectionProvider dir="rtl">
				<Select
					value={props.currentSelectedRank}
					defaultValue={props.defaultSelectedRank}
					onValueChange={handleValueChange}
				>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent className="max-h-64">
						{
							Object.values(UserRank).map((rank) => {
								return (
									<SelectItem
										value={rank}
										key={rank}
									>
										{rank}
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
