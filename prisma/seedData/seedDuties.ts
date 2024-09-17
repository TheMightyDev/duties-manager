import { type Duty, DutyKind, UserRole } from "@prisma/client";
import { addDays, subDays } from "date-fns";
import { seedOrganizations } from "prisma/seedData/seedOrganizations";

export const seedDuties = [
	{
		id: "duty1",
		organizationId: seedOrganizations[0].id,
		kind: DutyKind.GUARDING,
		startDate: subDays(new Date(), 11),
		endDate: subDays(new Date(), 10),
		role: UserRole.SQUAD,
		quantity: 3,
		score: 1,
		description: null,
	},
	{
		id: "duty1",
		organizationId: seedOrganizations[0].id,
		kind: DutyKind.GUARDING,
		startDate: subDays(new Date(), 11),
		endDate: subDays(new Date(), 10),
		role: UserRole.COMMANDER,
		quantity: 1,
		score: 1,
		description: null,
	},
	{
		id: "duty1",
		organizationId: seedOrganizations[0].id,
		kind: DutyKind.GUARDING,
		startDate: addDays(new Date(), 5),
		endDate: addDays(new Date(), 6),
		role: UserRole.SQUAD,
		quantity: 2,
		score: 1,
		description: null,
	},
	{
		id: "duty1",
		organizationId: seedOrganizations[0].id,
		kind: DutyKind.GUARDING,
		startDate: addDays(new Date(), 20),
		endDate: addDays(new Date(), 21),
		role: UserRole.OFFICER,
		quantity: 1,
		score: 1,
		description: null,
	},
] as const satisfies Duty[];
