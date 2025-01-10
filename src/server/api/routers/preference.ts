import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { PreferenceSchema } from "prisma/generated/zod";

export const preferenceRouter = createTRPCRouter({
	getUserExemptionsById: publicProcedure
		.input(z.string())
		.query(async ({ ctx, input: userId }) => {
			return ctx.db.preference.findMany({
				where: {
					userId,
				},
				select: {
					id: true,
					description: true,
					importance: true,
					startDate: true,
					endDate: true,
				},
			});
		}),

	getUserPreferencesById: publicProcedure
		.input(z.string())
		.query(async ({ ctx, input: userId }) => {
			return ctx.db.preference.findMany({
				where: {
					userId,
				},
			});
		}),

	create: publicProcedure
		.input(PreferenceSchema)
		.query(async ({ ctx, input }) => {
			try {
				await ctx.db.preference.create({
					data: input,
				});

				return true;
			} catch (e) {
				console.error("error", e);

				return false;
			}
		}),

	update: publicProcedure
		.input(PreferenceSchema.partial())
		.query(async ({ ctx, input }) => {
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
		}),

	delete: publicProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
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
		}),
});
