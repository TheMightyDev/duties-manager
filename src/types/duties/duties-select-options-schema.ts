import { UserRole } from "@prisma/client";
import { DutyKindSchema, UserRoleSchema } from "prisma/generated/zod";
import { z } from "zod";

export const DutiesSelectOptionsSchema = z.object({
	/** Optional. If given, selects only duties of any of the specified kinds */
	kinds: z.array(DutyKindSchema).min(1).nullable(),
	startYear: z.coerce.number(),
	/** Optional. If given, selects all relevant duties that **start**
	 * in a specific month in the given year
	 * (requires month index - start at index 0 - January) */
	startMonthIndex: z.coerce.number().min(0).max(11).nullable(),
	/** Optional. If given, selects only duties that demand any of the specified user roles */
	requiredUserRoles: z.array(UserRoleSchema).min(1).nullable(),
});

export type DutiesSelectOptions = z.infer<typeof DutiesSelectOptionsSchema>;

export const m: DutiesSelectOptions = {
	requiredUserRoles: [ UserRole.EXEMPT ],
	startYear: 2025,
	kinds: null,
	startMonthIndex: null,
};
