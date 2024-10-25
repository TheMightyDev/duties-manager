import { USE_DEFAULT_SCORE } from "@/app/_utils/constants";
import { createId } from "@paralleldrive/cuid2";
import { type Duty, DutyKind, UserRole } from "@prisma/client";
import { seedOrganizations } from "prisma/seed-data/seed-organizations";

export const seedDuties = [
	{
		id: createId(),
		organizationId: seedOrganizations[0].id,
		kind: DutyKind.GUARDING,
		startDate: new Date(Date.UTC(2024, 8, 30, 10, 0, 0)),
		endDate: new Date(Date.UTC(2024, 9, 1, 10, 0, 0)),
		role: UserRole.SQUAD,
		quantity: 2,
		score: USE_DEFAULT_SCORE,
		description: null,
	},
	{
		id: createId(),
		organizationId: seedOrganizations[0].id,
		kind: DutyKind.GUARDING,
		startDate: new Date(Date.UTC(2024, 9, 15, 10, 0, 0)),
		endDate: new Date(Date.UTC(2024, 9, 16, 10, 0, 0)),
		role: UserRole.SQUAD,
		quantity: 1,
		score: USE_DEFAULT_SCORE,
		description: null,
	},
	{
		id: createId(),
		organizationId: seedOrganizations[0].id,
		kind: DutyKind.GUARDING,
		startDate: new Date(Date.UTC(2024, 9, 31, 10, 0)),
		endDate: new Date(Date.UTC(2024, 10, 3, 10, 0)),
		role: UserRole.SQUAD,
		quantity: 1,
		score: USE_DEFAULT_SCORE,
		description: null,
	},
	{
		id: createId(),
		organizationId: seedOrganizations[0].id,
		kind: DutyKind.GUARDING,
		startDate: new Date(Date.UTC(2024, 9, 7, 10, 0)),
		endDate: new Date(Date.UTC(2024, 9, 8, 10, 0)),
		role: UserRole.SQUAD,
		quantity: 3,
		score: USE_DEFAULT_SCORE,
		description: null,
	},
] as const satisfies Duty[];
