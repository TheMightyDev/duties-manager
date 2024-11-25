import {
	createTRPCRouter,
	protectedProcedure
} from "@/server/api/trpc";
import { UserSchema } from "prisma/generated/zod";
import { z } from "zod";

export const uploadRouter = createTRPCRouter({
	uploadUsers: protectedProcedure
		.input(z.array(UserSchema))
		.query((async ({ ctx, input: users }) => {
			await ctx.db.user.createMany({
				data: users,
			});
		})),
});
