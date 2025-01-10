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
	phoneNumber: z
		.string()
		.trim()
		.refine(
			(value) =>
				value.length === 11 && value.includes("-") && value.startsWith("05"),
			{
				// TODO: Correct checking. 0544-123456 is legal and also 05xxiufdj-x
				message: "The phone number must be of form 05X-1234567",
			},
		),
	isAdmin: z.boolean(),
	gender: z.string(),
	permanentEntryDate: z.union([z.coerce.date().nullable(), z.literal("")]),
	adminNote: z
		.string()
		.trim()
		.min(4, "Please enter a valid value")
		.or(z.literal(""))
		.nullable(),
});
