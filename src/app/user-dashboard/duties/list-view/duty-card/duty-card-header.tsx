import { UserRoleMark } from "@/app/_components/svg-icons/user-roles/user-role-mark";
import { formatHhMm, getDateFormatted, getWeekday } from "@/app/_utils/date-format-utils";
import { type DutyWithAssignments } from "@/server/api/types/duty-with-assignments";
import { type TFn } from "@/types/tfn";
import { DutyKind } from "@prisma/client";
import { isSameDay } from "date-fns";
import { useLocale, useTranslations } from "next-intl";

function getFormattedDates({ startDate, endDate, dutyKind, locale, t }: {
	startDate: Date;
	endDate: Date;
	dutyKind: DutyKind;
	locale: string;
	t: TFn;
}): string[] {
	if (dutyKind === DutyKind.GUARDING) {
		return [
			getDateFormatted({
				date: startDate,
				locale,
			}) + "-" + getWeekday({
				date: endDate,
				locale,
			}),
		];
	}
	if (isSameDay(endDate, startDate)) {
		return [
			getDateFormatted({
				date: startDate,
				locale,
			}) + " " + formatHhMm(startDate) + " " + formatHhMm(endDate),
		];
	} else {
		return [
			`${t("General.from")}${getDateFormatted({
				date: startDate,
				locale,
			})} ${t("General.to")} ${getDateFormatted({
				date: endDate,
				locale,
			})}`,
			"",
		];
	}
}
interface DutyCardHeaderProps {
	duty: DutyWithAssignments;
}

export function DutyCardHeader({ duty }: DutyCardHeaderProps) {
	const t = useTranslations();
	const locale = useLocale();
	
	return (
		<div className="flex flex-row items-end justify-between rounded-xl bg-purple-400 p-1">
			<div className="flex flex-col flex-wrap gap-0.5">
				<h3 className="self-start text-xl font-bold">
					{t(`DutyKind.${duty.kind}`)}
				</h3>
				{getFormattedDates({
					startDate: duty.startDate,
					endDate: duty.endDate,
					dutyKind: duty.kind,
					locale,
					t,
				}).map((datePart) => (
					<span>{datePart}</span>
				))}
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
			</div>
		</div>
	);
};
