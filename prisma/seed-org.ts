import { seedAssignments } from "prisma/seed-data/seed-assignments";
import { seedDuties } from "prisma/seed-data/seed-duties";
import { seedExemptions } from "prisma/seed-data/seed-exemptions";
import { seedOrganizations } from "prisma/seed-data/seed-organizations";
import { seedPeriods } from "prisma/seed-data/seed-periods";
import { seedPreferences } from "prisma/seed-data/seed-preferences";
import { seedUsers } from "prisma/seed-data/seed-users";
import { db } from "../src/server/db";

async function main() {
	await db.organization.createMany({
		data: seedOrganizations,
		// In this seed data, the IDs are provided explicitly
		skipDuplicates: true,
	});
	
	await db.user.create({
		data: seedUsers[0],
	});
	
	await db.user.createMany({
		data: seedUsers,
		// In this seed data, the IDs are provided explicitly
		skipDuplicates: true,
	});
	
	await db.exemption.createMany({
		data: seedExemptions,
	});
	
	await db.period.createMany({
		data: seedPeriods,
	});
	
	await db.duty.createMany({
		data: seedDuties,
	});
	
	await db.assignment.createMany({
		data: seedAssignments,
	});
	
	await db.preference.createMany({
		data: seedPreferences,
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
