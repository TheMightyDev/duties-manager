"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select";
import { UserRank } from "@prisma/client";
import { DirectionProvider } from "@radix-ui/react-direction";

interface PrimitiveUserRankSelectProps {
	selectedRank: UserRank;
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
					value={props.selectedRank}
					onValueChange={handleValueChange}
				>
					<SelectTrigger className="w-20">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
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
