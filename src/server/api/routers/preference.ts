import { z } from "zod";

import {
	createTRPCRouter,
	publicProcedure
} from "@/server/api/trpc";
import { PreferenceImportance, PreferenceReason } from "@prisma/client";

const preferenceSchema = z.object({
	id: z.string(),
	userId: z.string(),
	startDate: z.date(),
	endDate: z.date(),
	reason: z.nativeEnum(PreferenceReason),
	importance: z.nativeEnum(PreferenceImportance),
	description: z.string(),
});

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
		
	create: publicProcedure
		.input(preferenceSchema)
		.query((async ({ ctx, input }) => {
			try {
				await ctx.db.preference.create({
					data: input,
				});
				
				return true;
			} catch (e) {
				console.error("error", e);
				
				return false;
			}
		})),
	
	update: publicProcedure
		.input(preferenceSchema.partial())
		.query((async ({ ctx, input }) => {
			try {
				if (!input.id) {
					throw new Error("Missing ID when updating a preference");
				}
				await ctx.db.preference.update({
					data: input,
					where: {
						id: input.id,
					},
				});
			
				return true;
			} catch (e) {
				console.error("error", e);
			
				return false;
			}
		})),
		
	delete: publicProcedure
		.input(z.object({
			id: z.string(),
		}))
		.query((async ({ ctx, input }) => {
			try {
				await ctx.db.preference.delete({
					where: {
						id: input.id,
					},
				});
			
				return true;
			} catch (e) {
				console.error("error", e);
			
				return false;
			}
		})),
		
});
