import { CommanderSvgIcon } from "@/app/_components/svg-icons/user-roles/commander-svg-icon";
import { ExemptSvgIcon } from "@/app/_components/svg-icons/user-roles/exempt-svg-icon";
import { OfficerSvgIcon } from "@/app/_components/svg-icons/user-roles/officer-svg-repo";
import { SquadSvgIcon } from "@/app/_components/svg-icons/user-roles/squad-svg-icon";
import { cn } from "@/app/_utils/cn";
import { formatDate } from "@/app/_utils/date-format-utils";
import { UserRole, type Period } from "@prisma/client";
import clsx from "clsx";

interface PeriodRecordProps {
	period: Period;
	isCurrentPeriod: boolean;
}

const roleBg = {
	[UserRole.SQUAD]: "bg-role-squad",
	[UserRole.OFFICER]: "bg-role-officer",
	[UserRole.COMMANDER]: "bg-role-commander",
	[UserRole.EXEMPT]: "bg-role-exempt",
} as const satisfies Record<UserRole, string>;

const roleBorder = {
	[UserRole.SQUAD]: "border-role-squad text-role-squad",
	[UserRole.OFFICER]: "border-role-officer text-role-officer",
	[UserRole.COMMANDER]: "border-role-commander text-role-commander",
	[UserRole.EXEMPT]: "border-role-exempt fill-role-exempt",
} as const satisfies Record<UserRole, string>;

const roleIcons = {
	[UserRole.SQUAD]: SquadSvgIcon,
	[UserRole.OFFICER]: OfficerSvgIcon,
	[UserRole.COMMANDER]: CommanderSvgIcon,
	[UserRole.EXEMPT]: ExemptSvgIcon,
} as const satisfies Record<UserRole, any>;

export function PeriodRecord({
	period,
	isCurrentPeriod,
}: PeriodRecordProps) {
	const obj = {
		elem: roleIcons[period.role],
	};
	
	const currentDate = new Date();
	
	return (
		<>
			<li className={clsx("mb-7", isCurrentPeriod ? "ms-7" : "ms-6")}>
				<span className={cn(
					" absolute -start-4 flex size-8 items-center justify-center rounded-full ring-8 ring-slate-300 dark:bg-blue-900 dark:ring-gray-900",
					isCurrentPeriod ? "size-10 -start-5 " : "size-8 -start-4",
					currentDate > period.startDate ? roleBg[period.role] + " text-white" : roleBorder[period.role] + " p-0.5  border-2 bg-slate-300"
				)}
				>
					<obj.elem className={clsx("fill-current ", isCurrentPeriod ? "size-7" : "size-6")} />
				</span>
				<h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">{period.role}</h3>
				<time className="mb-2 block text-sm font-normal leading-none text-slate-600 dark:text-slate-500">
					{formatDate(period.startDate)}
				</time>
			</li>
				
		</>
	);
};
