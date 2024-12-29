import { UserRoleMark } from "@/app/_components/svg-icons/user-roles/user-role-mark";
import { getDateFormatted } from "@/app/_utils/date-format-utils";
import { type DutyWithAssignments } from "@/server/api/types/duty-with-assignments";
import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";

interface DutyCardHeaderProps {
	duty: DutyWithAssignments;
}

export function DutyCardHeader({ duty }: DutyCardHeaderProps) {
	const t = useTranslations();
	const locale = useLocale();
	
	return (
		<div className="flex flex-row items-end justify-between rounded-xl bg-purple-400 p-1">
			<div className="flex flex-row flex-wrap gap-1">
				<h3 className="self-start text-xl font-bold">
					{t(`DutyKind.${duty.kind}`)}
				</h3>
				<span className="self-end">
					{format(duty.startDate, "yyyy-MM-dd hh:mm")}
					{" עד "}
					{getDateFormatted({
						date: duty.endDate,
						locale,
					})}
				</span>
			</div>
			<div className="flex flex-row justify-end gap-0.5">
				{
					duty.requiredRoles.map((role) => (
						<UserRoleMark
							key={role}
							role={role}
							hasTooltip={true}
							className="size-5 rounded-lg"
						/>
					))
				}
				{
					duty.requiredRoles.map((role) => (
						<UserRoleMark
							key={role}
							role={role}
							hasTooltip={true}
							className="size-5 rounded-lg"
						/>
					))
				}
			</div>
		</div>
	);
};
