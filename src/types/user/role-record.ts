import { UserRole } from "@prisma/client";
import { z } from "zod";

export const roleRecordSchema = z.object({
	role: z.nativeEnum(UserRole),
	/** The latest date of the user in role,
	 * `null` if the user currently fulfills the role
	 */
	latestFulfilledDate: z.date().nullable(),
});

export type RoleRecord = z.infer<typeof roleRecordSchema>;
