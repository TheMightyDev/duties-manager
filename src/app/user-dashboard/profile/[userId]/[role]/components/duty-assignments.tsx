import { DutyAssignmentCard } from "@/app/user-dashboard/profile/[userId]/[role]/components/duty-assignment-card";
import { type UserWithAssignments } from "@/server/api/types/user-with-assignments";

interface DutyAssignmentsProps {
	assignments: UserWithAssignments["assignments"];
}

export function DutyAssignments({ assignments }: DutyAssignmentsProps) {
	return (
		<div className="flex w-full flex-col gap-2 p-2">
			{
				assignments.length === 0 &&
				<p className="text-center font-bold">
					אין שיבוצים להצגה
				</p>
			}
			{
				assignments.map((assignment) => (
					<DutyAssignmentCard
						key={assignment.id}
						duty={assignment.duty}
					/>
				))
			}
		</div>
	);
};
