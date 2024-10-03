import { z } from "zod";

import {
	createTRPCRouter,
	publicProcedure
} from "@/server/api/trpc";
import { PreferenceImportance, PreferenceReason } from "@prisma/client";

export const preferenceRouter = createTRPCRouter({
	getUserPreferencesInMonth: publicProcedure
		.input(z.object({
			userId: z.string(),
			year: z.number(),
			month: z.number().min(0).max(11),
		}))
		.query((async ({ ctx, input }) => {
			return ctx.db.preference.findMany();
		})),
		
	addNew: publicProcedure
		.input(z.object({
			id: z.string(),
			userId: z.string(),
			startDate: z.date(),
			endDate: z.date(),
			reason: z.nativeEnum(PreferenceReason),
			importance: z.nativeEnum(PreferenceImportance),
			description: z.string(),
		}))
		.query((async ({ ctx, input }) => {
			try {
				const createdRecord = await ctx.db.preference.create({
					data: input,
				});
				
				console.log("@createdRecord", createdRecord);

				return true;
			} catch (e) {
				console.error("error", e);
				
				return false;
			}
		})),
		
	deleteById: publicProcedure
		.input(z.string())
		.query((async ({ ctx, input: id }) => {
			try {
				await ctx.db.preference.delete({
					where: {
						id,
					},
				});
			
				return true;
			} catch (e) {
				console.error("error", e);
			
				return false;
			}
		})),
});
