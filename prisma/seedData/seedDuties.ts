import { type Duty, DutyKind, UserRole } from "@prisma/client";
import { subDays } from "date-fns";
import { seedOrganizations } from "prisma/seedData/seedOrganizations";

export const seedDuties = [
	{
		id: "duty1",
		organizationId: seedOrganizations[0].id,
		kind: DutyKind.Guarding,
		startDate: subDays(new Date(), 11),
		endDate: subDays(new Date(), 10),
		role: UserRole.Squad,
		quantity: 3,
		score: 3,
		description: null,
	},
] as const satisfies Duty[];
