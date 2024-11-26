import {
	adminProcedure,
	createTRPCRouter
} from "@/server/api/trpc";
import { PeriodSchema, UserSchema } from "prisma/generated/zod";
import { z } from "zod";

export const uploadRouter = createTRPCRouter({
	uploadUsers: adminProcedure
		.input(z.array(UserSchema))
		.query((async ({ ctx, input: users }) => {
			return await ctx.db.user.createMany({
				data: users,
			});
		})),
	
	uploadPeriods: adminProcedure
		.input(z.array(PeriodSchema))
		.query((async ({ ctx, input: periods }) => {
			return await ctx.db.period.createMany({
				data: periods,
			});
		})),
});
