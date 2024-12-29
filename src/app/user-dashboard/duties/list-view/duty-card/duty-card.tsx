import { DutyCardHeader } from "@/app/user-dashboard/duties/list-view/duty-card/duty-card-header";
import { type DutyWithAssignments } from "@/server/api/types/duty-with-assignments";

interface DutyCardProps {
	duty: DutyWithAssignments;
}

export function DutyCard({ duty }: DutyCardProps) {
	return (
		<div className="w-96 ">
			<DutyCardHeader duty={duty} />
		</div>
	);
};
