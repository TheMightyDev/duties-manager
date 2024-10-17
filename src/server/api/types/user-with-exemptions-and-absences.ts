import { PreferenceImportance, PreferenceReason, Prisma } from "@prisma/client";

export const userWithExemptionsAndAbsencesInclude = Prisma.validator<Prisma.UserSelect>()({
	preferences: {
		where: {
			OR: [
				{
					reason: PreferenceReason.EXEMPTION,
					importance: PreferenceImportance.NO_GUARDING,
					endDate: {
						not: null,
					},
				},
				{
					reason: PreferenceReason.ABSENCE,
				},
			],
		},
	},
});

export type UserWithExemptionsAndAbsences = Prisma.UserGetPayload<{
	select: typeof userWithExemptionsAndAbsencesInclude;
}>;
