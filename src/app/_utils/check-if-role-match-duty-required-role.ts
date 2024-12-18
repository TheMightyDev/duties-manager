import { type UserRole } from "@prisma/client";

// TODO: Turn this function into a more sophisticated once duties have a complex logic to determine which roles are required. E.g.: `DutyRoleRequirement.ExemptOrSquad`
export function checkIfRoleMatchDutyRequiredRole({ role, dutyRoleRequirement }: {
	role: UserRole;
	dutyRoleRequirement: UserRole;
}): boolean {
	return role === dutyRoleRequirement;
}
