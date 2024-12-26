import { EditViewOptionsDialog } from "@/app/user-dashboard/duties/list-view/edit-view-options-dialog";
import { type DutiesSelectOptions } from "@/types/duties/duties-select-options-schema";
import { DutyGroupKind } from "@/types/duties/duty-group-kind";
import { DutyKind } from "@prisma/client";
import { useTranslations } from "next-intl";

interface DutiesListViewHeaderProps {
	viewOptions: DutiesSelectOptions;
	changeViewOptions: (nextOptions: DutiesSelectOptions) => void;
}

function getDutyGroupKind(dutyKinds: DutyKind[]): DutyGroupKind {
	if (dutyKinds.length === 0) return DutyGroupKind.ALL;
	
	if (dutyKinds.length === 1 && dutyKinds[0] === DutyKind.GUARDING) {
		return DutyGroupKind.GUARDING_ONLY;
	};
	if (dutyKinds.length === 2 &&
		dutyKinds.includes(DutyKind.CAMP_DEFENSE) &&
		dutyKinds.includes(DutyKind.SETTLEMENTS_DEFENSE)) {
		return DutyGroupKind.CAMP_OR_SETTLEMENT_DEFENSE;
	}
	if (!dutyKinds.includes(DutyKind.GUARDING) &&
		!dutyKinds.includes(DutyKind.CAMP_DEFENSE) &&
		!dutyKinds.includes(DutyKind.SETTLEMENTS_DEFENSE)) {
		return DutyGroupKind.MISC_DUTIES;
	} else {
		return DutyGroupKind.ALL;
	}
}

export function DutiesListViewHeader(props: DutiesListViewHeaderProps) {
	const t = useTranslations();
	
	const dutyGroupKind = getDutyGroupKind(props.viewOptions.kinds ?? []);

	return (
		<header>
			{t(`DutyGroupKind.${dutyGroupKind}`)}
			<EditViewOptionsDialog {...props} />
		</header>
	);
};
