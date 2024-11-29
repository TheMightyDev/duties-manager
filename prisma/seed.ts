import { seedOrganizations } from "prisma/seed-data/seed-organizations";
import { seedPeriods } from "prisma/seed-data/seed-periods";
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
	
	await db.period.create({
		data: seedPeriods[0],
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
