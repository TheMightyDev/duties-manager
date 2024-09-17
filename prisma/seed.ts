import { seedDuties } from "prisma/seedData/seedDuties";
import { seedOrganizations } from "prisma/seedData/seedOrganizations";
import { seedUsers } from "prisma/seedData/seedUsers";
import { db } from "../src/server/db";

async function main() {
	await db.organization.createMany({
		data: seedOrganizations,
		skipDuplicates: true,
	})
	
  await db.user.createMany({
		data: seedUsers,
		skipDuplicates: true,
	})
	
	await db.duty.createMany({
		data: seedDuties,
		skipDuplicates: true,
	})
	
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
