import { type DutiesSelectOptions } from "@/types/duties/duties-select-options-schema";
import { DutyKind } from "@prisma/client";

export const initialDutiesSelectOptions: DutiesSelectOptions = {
	startYear: new Date().getFullYear(),
	startMonthIndex: null,
	kinds: [ DutyKind.CAMP_DEFENSE, DutyKind.SETTLEMENTS_DEFENSE ],
	requiredUserRoles: null,
};
