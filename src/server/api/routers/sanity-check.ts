import {
	adminProcedure,
	createTRPCRouter
} from "@/server/api/trpc";

export const sanityCheckRouter = createTRPCRouter({
	runChecks: adminProcedure
		.query(async function* () {
			for (let i = 0; i < 3; i++) {
				await new Promise((resolve) => setTimeout(resolve, 2_000));
				yield i;
			}
		}),
});
