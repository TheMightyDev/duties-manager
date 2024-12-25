import { z } from "zod";

import {
	createTRPCRouter,
	publicProcedure
} from "@/server/api/trpc";

export const invitationRouter = createTRPCRouter({
	getUserByInviteCode: publicProcedure
		.input(z.string())
		.query(async ({ ctx, input: inviteCode }) => {
			const invitation = await ctx.db.invitation.findUnique({
				where: {
					inviteCode,
					expireDate: {
						gt: new Date(),
					},
				},
				include: {
					user: true,
				},
			});
			
			return invitation?.user;
		}),
});
