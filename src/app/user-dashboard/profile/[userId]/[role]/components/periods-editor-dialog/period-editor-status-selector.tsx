"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select";
import { PeriodStatus } from "@prisma/client";
import { DirectionProvider } from "@radix-ui/react-direction";

interface PeriodEditorStatusSelectorProps {
	selectedStatus: PeriodStatus;
	changeStatus: (nextRole: PeriodStatus) => void;
}

export function PeriodEditorStatusSelector(props: PeriodEditorStatusSelectorProps) {
	function handleValueChange(nextStatus: string) {
		props.changeStatus(nextStatus as PeriodStatus);
	}
	
	return (
		<>
			<DirectionProvider dir="rtl">
				<Select
					value={props.selectedStatus}
					onValueChange={handleValueChange}
				>
					<SelectTrigger className="w-40">
						<SelectValue placeholder="Theme" />
					</SelectTrigger>
					<SelectContent>
						{
							Object.values(PeriodStatus).map((status) => {
								return (
									<SelectItem
										value={status}
										key={status}
									>
										<div className="flex flex-row items-center gap-2">
											{status}
										</div>
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
