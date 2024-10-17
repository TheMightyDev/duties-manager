import { seedAssignments } from "prisma/seed-data/seed-assignments";
import { seedDuties } from "prisma/seed-data/seed-duties";
import { seedOrganizations } from "prisma/seed-data/seed-organizations";
import { seedPreferences } from "prisma/seed-data/seed-preferences";
import { seedUsers } from "prisma/seed-data/seed-users";
import { db } from "../src/server/db";

async function main() {
	await db.organization.createMany({
		data: seedOrganizations,
		skipDuplicates: true,
	});
	
	await db.user.createMany({
		data: seedUsers,
		skipDuplicates: true,
	});
	
	await db.duty.createMany({
		data: seedDuties,
		skipDuplicates: true,
	});
	
	await db.assignment.createMany({
		data: seedAssignments,
		skipDuplicates: true,
	});
	
	await db.preference.createMany({
		data: seedPreferences,
		skipDuplicates: true,
	});
	
	console.log("The database was seeded successfully!");
}

main()
	.then(async () => {
		await db.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await db.$disconnect();
		process.exit(1);
	});
