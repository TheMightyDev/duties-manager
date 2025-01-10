import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { PeriodStatus } from "@prisma/client";

export const eventRouter = createTRPCRouter({
	getUserEvents: publicProcedure
		.input(
			z.object({
				userId: z.string(),
				includePreferences: z.boolean().optional(),
			}),
		)
		.query(async ({ ctx, input: { userId, includePreferences = true } }) => {
			const events = [];

			const absences = await ctx.db.period.findMany({
				select: {
					id: true,
					startDate: true,
					endDate: true,
					description: true,
				},
				where: {
					userId: userId,
					status: PeriodStatus.TEMPORARILY_ABSENT,
				},
			});

			events.push(...absences);

			// if (includePreferences) {
			const preferences = await ctx.db.preference.findMany({
				select: {
					id: true,
					startDate: true,
					endDate: true,
					importance: true,
					kind: true,
					description: true,
				},
				where: {
					userId: userId,
				},
			});

			events.push(...preferences);
			// }

			return events;
		}),
});
