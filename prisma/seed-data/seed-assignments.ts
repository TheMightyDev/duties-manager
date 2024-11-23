import { createId } from "@paralleldrive/cuid2";
import { type Assignment } from "@prisma/client";
import { seedDuties } from "prisma/seed-data/seed-duties";

export const seedAssignments = [
	{
		id: createId(),
		dutyId: seedDuties[0].id,
		assigneeId: "valerik",
		reserveId: null,
		extraScore: null,
	},
	{
		id: createId(),
		dutyId: seedDuties[0].id,
		assigneeId: "roim",
		reserveId: null,
		extraScore: null,
	},
	{
		id: createId(),
		dutyId: seedDuties[1].id,
		assigneeId: "ronis",
		reserveId: null,
		extraScore: null,
	},
	{
		id: createId(),
		dutyId: seedDuties[2].id,
		assigneeId: "bars",
		reserveId: null,
		extraScore: null,
	},
	{
		id: createId(),
		dutyId: seedDuties[3].id,
		assigneeId: "shania",
		reserveId: null,
		extraScore: null,
	},
	{
		id: createId(),
		dutyId: seedDuties[3].id,
		assigneeId: "ronis",
		reserveId: null,
		extraScore: null,
	},
	{
		id: createId(),
		dutyId: seedDuties[3].id,
		assigneeId: "bars",
		reserveId: null,
		extraScore: null,
	},
	{
		id: createId(),
		dutyId: seedDuties[4].id,
		assigneeId: "yuvala",
		reserveId: null,
		extraScore: null,
	},
	{
		id: createId(),
		dutyId: seedDuties[4].id,
		assigneeId: "omern",
		reserveId: null,
		extraScore: null,
	},
	{
		id: createId(),
		dutyId: seedDuties[5].id,
		assigneeId: "shania",
		reserveId: null,
		extraScore: null,
	},
	{
		id: createId(),
		dutyId: seedDuties[5].id,
		assigneeId: "ronis",
		reserveId: null,
		extraScore: null,
	},
	{
		id: createId(),
		dutyId: seedDuties[5].id,
		assigneeId: "valerik",
		reserveId: null,
		extraScore: null,
	},
	{
		id: createId(),
		dutyId: seedDuties[6].id,
		assigneeId: "noams",
		reserveId: null,
		extraScore: null,
	},
] as const satisfies Assignment[];
