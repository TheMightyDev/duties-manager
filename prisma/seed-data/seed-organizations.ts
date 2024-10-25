import type { Organization } from "@prisma/client";

export const seedOrganizations = [
	{
		id: "organization1",
		name: "prisma",
		description: "best unit in the world",
	},
] as const satisfies Organization[];
