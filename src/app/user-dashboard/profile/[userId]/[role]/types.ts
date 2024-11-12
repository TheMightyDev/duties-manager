import { type UserWithAssignments } from "@/server/api/types/user-with-assignments";
import { type UserJustice } from "@/types/justice/user-justice";
import { type RoleRecord } from "@/types/user/role-record";
import { type UserRole } from "@prisma/client";

export interface UserProfileProps {
	userJustice: UserJustice;
	userPosition: number;
	totalRelevantUsersCount: number;
	assignments: UserWithAssignments["assignments"];
	roleRecords: RoleRecord[];
}

export interface ProfileRoleSelectorProps {
	roleRecords: RoleRecord[];
	selectedRole: UserRole;
}
