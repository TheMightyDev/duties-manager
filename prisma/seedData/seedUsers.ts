import { type User, UserRole } from "@prisma/client";
import { addMonths } from "date-fns";
import { seedOrganizations } from "prisma/seedData/seedOrganizations";

export const seedUsers = [
	{
		id: "user1",
		firstName: "alon",
		lastName: "aiden",
		email: "user1@example.com",		
		emailVerified: addMonths(new Date(), -1),
		organizationId: seedOrganizations[0].id,
		isAdmin: false,
		roleStartDate: addMonths(new Date(), -2),
		retireDate: addMonths(new Date(), 2),
		role: UserRole.Squad,
	},
] as const satisfies User[];
