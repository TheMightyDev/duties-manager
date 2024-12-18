import {
	adminProcedure,
	createTRPCRouter
} from "@/server/api/trpc";
import { type UserWithAssignmentsAndPeriods, userWithAssignmentsAndPeriodsInclude } from "@/server/api/types/user-with-assignments-and-periods";
import { format } from "date-fns";

function getAllUserAssignmentsErrors({ user }: {
	user: UserWithAssignmentsAndPeriods;
}): string[] {
	const errorMessages: string[] = [];
	
	if (user.periods.length === 0) {
		errorMessages.push("The user has no periods!");
		
		return errorMessages;
	}
	
	// There must be at least one period because we returned from the function if there are no periods
	// And the array for sure only includes periods
	const unitJoinDate = user.periods[0]!.startDate;
	const unitLeaveDate = user.periods.at(-1)!.endDate;
	const formatDate = (date: Date) => format(date, "yyyy-MM-dd");
	user.assignments.forEach((assignment) => {
		if (assignment.duty.startDate < unitJoinDate) {
			errorMessages.push(`The duty at ${formatDate(assignment.duty.startDate)} starts before the user joined the unit (${formatDate(unitJoinDate)})`);
		}
		if (assignment.duty.startDate > unitLeaveDate || assignment.duty.endDate > unitLeaveDate) {
			errorMessages.push(`The duty at ${formatDate(assignment.duty.startDate)} exceeds the user leaving the unit (${formatDate(unitLeaveDate)})`);
		}
	});
	
	return errorMessages;
}

export const sanityCheckRouter = createTRPCRouter({
	runChecksAndGenerateErrors: adminProcedure
		.query(async function* ({ ctx }) {
			const adminOrganizationId = ctx.session.user.organizationId;
			
			const allUsersInOrganization = await ctx.db.user.findMany({
				include: userWithAssignmentsAndPeriodsInclude,
				where: {
					organizationId: adminOrganizationId,
				},
			});
			
			// Simple loops are used instead of `forEach`,
			// because you can't yield from inner functions cleanly
			for (const user of allUsersInOrganization) {
				const errors = getAllUserAssignmentsErrors({
					user,
				});
				
				for (const error of errors) {
					yield `${user.id} - ${user.firstName} ${user.lastName} - ${error}`;
				}
			}
			
			// for (let i = 0; i < 3; i++) {
			// 	await new Promise((resolve) => setTimeout(resolve, 2_000));
			// 	yield i;
			// }
		}),
});
