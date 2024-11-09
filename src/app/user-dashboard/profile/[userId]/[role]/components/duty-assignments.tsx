import { DutyAssignmentCard } from "@/app/user-dashboard/profile/[userId]/[role]/components/duty-assignment-card";
import { type UserProfileProps } from "@/app/user-dashboard/profile/[userId]/[role]/types";

export function DutyAssignments({ assignments }: UserProfileProps) {
	return (
		<div className="flex w-full flex-col gap-2 p-2">
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
