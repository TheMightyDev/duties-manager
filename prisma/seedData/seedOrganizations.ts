import type { Organization } from "@prisma/client";

export const seedOrganizations = [
	{
		id: "organization1",
		name: "prisma",
		description: "best unit in the world",
	},
	{
		id: "organization2",
		name: "matzov",
		description: "yet another good unit",
	},
] as const satisfies Organization[];
