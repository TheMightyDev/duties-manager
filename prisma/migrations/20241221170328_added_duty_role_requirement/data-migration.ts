import { type DutyRoleRequirement, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	await prisma.$transaction(async (tx) => {
		const duties = await tx.duty.findMany();
		for (const duty of duties) {
			await tx.duty.update({
				where: {
					id: duty.id,
				},
				data: {
					roleRequirement: duty.role as DutyRoleRequirement,
				},
			});
		}
	});
}

main()
	.catch(async (e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
