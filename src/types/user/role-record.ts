import { UserRole } from "@prisma/client";
import { z } from "zod";

export const roleRecordSchema = z.object({
	role: z.nativeEnum(UserRole),
	latestFulfilledDate: z.date(),
});

export type RoleRecord = z.infer<typeof roleRecordSchema>;
