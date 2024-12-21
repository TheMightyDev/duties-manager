import { DutyRoleRequirement, PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

const rolesPerDutyRoleRequirement: Record<DutyRoleRequirement, UserRole[]> = {
	[DutyRoleRequirement.ANY]: [ UserRole.SQUAD, UserRole.OFFICER, UserRole.COMMANDER, UserRole.EXEMPT ],
	[DutyRoleRequirement.SQUAD]: [ UserRole.SQUAD ],
	[DutyRoleRequirement.OFFICER]: [ UserRole.OFFICER ],
	[DutyRoleRequirement.COMMANDER]: [ UserRole.COMMANDER ],
	[DutyRoleRequirement.EXEMPT]: [ UserRole.EXEMPT ],
	[DutyRoleRequirement.EXEMPT_AND_SQUAD]: [ UserRole.EXEMPT, UserRole.SQUAD ],
	[DutyRoleRequirement.SQUAD_AND_EXEMPT]: [ UserRole.SQUAD, UserRole.EXEMPT ],
	[DutyRoleRequirement.OFFICER_AND_COMMANDER]: [ UserRole.OFFICER, UserRole.COMMANDER ],
	[DutyRoleRequirement.COMMANDER_AND_OFFICER]: [ UserRole.COMMANDER, UserRole.OFFICER ],
};

async function main() {
	await prisma.$transaction(async (tx) => {
		const duties = await tx.duty.findMany();
		for (const duty of duties) {
			await tx.duty.update({
				where: {
					id: duty.id,
				},
				data: {
					requiredRoles: duty.roleRequirement ? rolesPerDutyRoleRequirement[duty.roleRequirement] : [],
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
