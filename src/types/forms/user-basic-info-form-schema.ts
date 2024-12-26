import { UserRankSchema } from "prisma/generated/zod";
import { z } from "zod";

export const UserBasicInfoFormSchema = z.object({
	id: z.string(),
	firstName: z.string().trim().min(2, {
		message: "first name must be at least 2 characters",
	}),
	lastName: z.string().trim().min(2, {
		message: "first name must be at least 2 characters",
	}),
	rank: UserRankSchema,
	phoneNumber: z.string().trim().refine((value) => (
		value.length === 11 &&
		value.includes("-") &&
		value.startsWith("05")
	), {
		message: "The phone number must be of form 05X-1234567",
	}),
	isAdmin: z.boolean(),
	gender: z.string(),
	permanentEntryDate: z.coerce.date().nullable(),
	adminNote: z.string().nullable(),
});
