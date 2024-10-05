import { z } from "zod";

import {
	createTRPCRouter,
	publicProcedure
} from "@/server/api/trpc";

// const dutySchema = z.object({
// 	id: z.string(),
// 	kind: z.nativeEnum(DutyKind),
// 	organizationId: z.string(),
// 	startDate: z.date(),
// 	endDate: z.date(),
// 	role: z.nativeEnum(UserRole),
// 	quantity: z.number().min(1),
// 	score: z.number(),
// 	description: z.string().nullable(),
// }) satisfies ZodType<Duty>;

export const dutyRouter = createTRPCRouter({
	/** Returns all duties that either start or the end on the input month */
	getAllInMonth: publicProcedure
		.input(z.object({
			year: z.number(),
			monthIndex: z.number().min(0).max(11),
		}))
		.query((async ({ ctx, input: { year, monthIndex } }) => {
			const firstDayInMonth = new Date(year, monthIndex, 1);
			const lastDayInMonth = new Date(year, monthIndex + 1, 23, 59, 59, 999);
			
			return ctx.db.duty.findMany({
				where: {
					OR: [
						{
							startDate: {
								gte: firstDayInMonth,
								lte: lastDayInMonth,
							},
						},
						{
							endDate: {
								gte: firstDayInMonth,
								lte: lastDayInMonth,
							},
						},
					],
				},
			});
		})),
});
