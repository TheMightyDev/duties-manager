import { type DutiesSelectOptions } from "@/types/duties/duties-select-options-schema";

export const initialDutiesSelectOptions: DutiesSelectOptions = {
	startYear: new Date().getFullYear(),
	startMonthIndex: null,
	kinds: null,
	requiredUserRoles: null,
};
