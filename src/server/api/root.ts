import { dutyRouter } from "@/server/api/routers/duty";
import { eventRouter } from "@/server/api/routers/event";
import { invitationRouter } from "@/server/api/routers/invitation";
import { justiceRouter } from "@/server/api/routers/justice";
import { possibleAssignmentsRouter } from "@/server/api/routers/possible-assignments";
import { postRouter } from "@/server/api/routers/post";
import { preferenceRouter } from "@/server/api/routers/preference";
import { sanityCheckRouter } from "@/server/api/routers/sanity-check";
import { uploadRouter } from "@/server/api/routers/upload";
import { userRouter } from "@/server/api/routers/user";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	user: userRouter,
	post: postRouter,
	event: eventRouter,
	preference: preferenceRouter,
	duty: dutyRouter,
	justice: justiceRouter,
	possibleAssignments: possibleAssignmentsRouter,
	upload: uploadRouter,
	sanityCheck: sanityCheckRouter,
	invitation: invitationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
