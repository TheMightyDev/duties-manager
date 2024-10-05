import { type Duty, DutyKind, UserRole } from "@prisma/client";
import { seedOrganizations } from "prisma/seedData/seedOrganizations";

export const seedDuties = [
	{
		id: "duty1",
		organizationId: seedOrganizations[0].id,
		kind: DutyKind.GUARDING,
		startDate: new Date(Date.UTC(2024, 8, 24, 10, 0)),
		endDate: new Date(Date.UTC(2024, 8, 27, 10, 0)),
		role: UserRole.SQUAD,
		quantity: 3,
		score: 1,
		description: null,
	},
	{
		id: "duty2",
		organizationId: seedOrganizations[0].id,
		kind: DutyKind.GUARDING,
		startDate: new Date(Date.UTC(2024, 8, 28, 10, 0)),
		endDate: new Date(Date.UTC(2024, 8, 29, 10, 0)),
		role: UserRole.COMMANDER,
		quantity: 1,
		score: 1,
		description: null,
	},
	{
		id: "duty3",
		organizationId: seedOrganizations[0].id,
		kind: DutyKind.GUARDING,
		startDate: new Date(Date.UTC(2024, 9, 7, 10, 0)),
		endDate: new Date(Date.UTC(2024, 9, 8, 10, 0)),
		role: UserRole.SQUAD,
		quantity: 2,
		score: 1,
		description: null,
	},
	{
		id: "duty4",
		organizationId: seedOrganizations[0].id,
		kind: DutyKind.GUARDING,
		startDate: new Date(Date.UTC(2024, 9, 24, 10, 0)),
		endDate: new Date(Date.UTC(2024, 9, 27, 10, 0)),
		role: UserRole.OFFICER,
		quantity: 1,
		score: 1,
		description: null,
	},
] as const satisfies Duty[];
