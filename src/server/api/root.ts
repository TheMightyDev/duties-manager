import { dutyRouter } from "@/server/api/routers/duty";
import { justiceRouter } from "@/server/api/routers/justice";
import { possibleAssignmentsRouter } from "@/server/api/routers/possible-assignments";
import { postRouter } from "@/server/api/routers/post";
import { preferenceRouter } from "@/server/api/routers/preference";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	post: postRouter,
	preference: preferenceRouter,
	duty: dutyRouter,
	justice: justiceRouter,
	possibleAssignments: possibleAssignmentsRouter,
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
