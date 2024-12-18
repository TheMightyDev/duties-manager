import { DutyAssignmentCard } from "@/app/user-dashboard/profile/[userId]/[role]/components/duty-assignment-card";
import { type UserWithAssignments } from "@/server/api/types/user-with-assignments";

interface DutyAssignmentsGroupProps {
	title: string;
	assignments: UserWithAssignments["assignments"];
}

export function DutyAssignmentsGroup(props: DutyAssignmentsGroupProps) {
	return (
		<>
			<h4 className="text-center text-lg font-bold">
				{props.title} ({ props.assignments.length })
			</h4>
			{
				props.assignments.map((assignment) => (
					<DutyAssignmentCard
						key={assignment.id}
						duty={assignment.duty}
					/>
				))
			}
		</>
	);
};
