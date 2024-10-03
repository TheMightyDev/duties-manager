import { z } from "zod";

import {
	createTRPCRouter,
	publicProcedure
} from "@/server/api/trpc";

export const preferenceRouter = createTRPCRouter({
	getUserPreferencesInMonth: publicProcedure
		.input(z.object({
			userId: z.string(),
			year: z.number(),
			month: z.number().min(0).max(11),
		}))
		.query((async ({ ctx, input }) => {
			return ctx.db.preference.findMany({
				where: {
					userId: input.userId,
				}
			})
		})),
});
