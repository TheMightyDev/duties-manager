import { OfficerSvgIcon } from "@/app/_components/svg-icons/user-roles/officer-svg-repo";
import { type Duty } from "@prisma/client";
import { format } from "date-fns";

interface DutyAssignmentCardProps {
	duty: Duty;
}

export function DutyAssignmentCard({ duty }: DutyAssignmentCardProps) {
	return (
		<div className="rounded-xl bg-blue-500 text-white">
			<div>
				<OfficerSvgIcon className="size-12 fill-white"/>
				<span className="font-bold">{duty.kind}</span>
			</div>
			<p>{format(duty.startDate, "yyyy-MM-dd")}</p>
		</div>
	);
};
