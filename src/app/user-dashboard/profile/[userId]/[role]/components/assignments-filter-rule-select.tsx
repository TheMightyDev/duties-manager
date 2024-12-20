import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select";
import { AssignmentsFilterRule } from "@/app/user-dashboard/profile/[userId]/[role]/types";
import { DirectionProvider } from "@radix-ui/react-direction";

interface AssignmentsFilterRuleSelectProps {
	selectedFilterRule: AssignmentsFilterRule;
	handleFilterRuleChange: (nextFilterRule: AssignmentsFilterRule) => void;
}

export function AssignmentsFilterRuleSelect(props: AssignmentsFilterRuleSelectProps) {
	function handleValueChange(nextFilterRule: string) {
		props.handleFilterRuleChange(nextFilterRule as AssignmentsFilterRule);
	}
		
	return (
		<>
			<DirectionProvider dir="rtl">
				<Select
					value={props.selectedFilterRule}
					onValueChange={handleValueChange}
				>
					<SelectTrigger className="absolute w-44">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{
							Object.values(AssignmentsFilterRule).map((filterRule) => {
								return (
									<SelectItem
										value={filterRule}
										key={filterRule}
									>
										{filterRule}
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
