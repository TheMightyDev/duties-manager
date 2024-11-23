import { LockSvgIcon } from "@/app/_components/svg-icons/ui/lock-svg-icon";
import { OfficerSvgIcon } from "@/app/_components/svg-icons/user-roles/officer-svg-repo";
import { type Duty } from "@prisma/client";
import { format } from "date-fns";

interface DutyAssignmentCardProps {
	duty: Duty;
}

export function DutyAssignmentCard({ duty }: DutyAssignmentCardProps) {
	return (
		<div className="relative rounded-xl bg-blue-500 text-white">
			<div>
				<OfficerSvgIcon className="size-12 fill-white"/>
				<span className="font-bold">{duty.kind}</span>
			</div>
			
			<p>{format(duty.startDate, "yyyy-MM-dd")}</p>
			
			{duty.isPrivate && <LockSvgIcon className="absolute end-1 top-1 size-8 stroke-white"/>}
		</div>
	);
};
