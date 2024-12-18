import { DutyAssignmentsGroup } from "@/app/user-dashboard/profile/[userId]/[role]/components/duty-assignments-group";
import { type UserWithAssignments } from "@/server/api/types/user-with-assignments";
import { useMemo } from "react";

interface DutyAssignmentsProps {
	assignments: UserWithAssignments["assignments"];
}

export function DutyAssignments({ assignments }: DutyAssignmentsProps) {
	const currentDate = new Date();
	
	const orderEarliestAssignmentsFirst = (a: UserWithAssignments["assignments"][0], b: UserWithAssignments["assignments"][0]) => (
		a.duty.startDate.getTime() - b.duty.startDate.getTime()
	);
	
	const futureAssignments = useMemo(() => (
		assignments
			.filter((assignment) => assignment.duty.startDate > currentDate)
			.sort(orderEarliestAssignmentsFirst)
	), [ assignments ]);
	
	const pastAssignments = useMemo(() => (
		assignments.filter((assignment) => assignment.duty.startDate <= currentDate)
	), [ assignments ]);
	
	return (
		<div className="flex w-full flex-col gap-2 p-2">
			{
				assignments.length === 0 &&
				<p className="text-center font-bold">
					אין שיבוצים להצגה
				</p>
			}
			{
				futureAssignments.length > 0 &&
				<DutyAssignmentsGroup
					title="תורנויות עתידיות"
					assignments={futureAssignments}
				/>
			}
			{
				pastAssignments.length > 0 &&
				<DutyAssignmentsGroup
					title="תורנויות עבר"
					assignments={pastAssignments}
				/>
			}
		</div>
	);
};
