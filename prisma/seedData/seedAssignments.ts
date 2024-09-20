import { createId } from "@paralleldrive/cuid2";
import { type Assignment } from "@prisma/client";
import { seedDuties } from "prisma/seedData/seedDuties";
import { seedUsers } from "prisma/seedData/seedUsers";

export const seedAssignments = [
	{
		id: createId(),
		dutyId: seedDuties[0].id,
		userId: seedUsers[0].id,
		reserveId: seedUsers[1].id,
	},
	{
		id: createId(),
		dutyId: seedDuties[0].id,
		userId: seedUsers[2].id,
		reserveId: seedUsers[3].id,
	},
	{
		id: createId(),
		dutyId: seedDuties[1].id,
		userId: seedUsers[6].id,
		reserveId: seedUsers[7].id,
	},
	{
		id: createId(),
		dutyId: seedDuties[2].id,
		userId: seedUsers[1].id,
		reserveId: seedUsers[0].id,
	},
	{
		id: createId(),
		dutyId: seedDuties[2].id,
		userId: seedUsers[3].id,
		reserveId: seedUsers[2].id,
	},
	{
		id: createId(),
		dutyId: seedDuties[3].id,
		userId: seedUsers[5].id,
		reserveId: seedUsers[4].id,
	},
] as const satisfies Assignment[];
