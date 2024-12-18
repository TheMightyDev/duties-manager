import { checkIfRoleMatchDutyRequiredRole } from "@/app/_utils/check-if-role-match-duty-required-role";
import {
	adminProcedure,
	createTRPCRouter
} from "@/server/api/trpc";
import { type UserWithAssignmentsAndPeriods, userWithAssignmentsAndPeriodsInclude } from "@/server/api/types/user-with-assignments-and-periods";
import { type SanityCheckError } from "@/types/sanity-check/sanity-check-error";
import { SanityCheckErrorKind } from "@/types/sanity-check/sanity-check-error-kind";
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
		const duty = assignment.duty;
		
		if (duty.startDate < unitJoinDate) {
			errorMessages.push(`The duty at ${formatDate(duty.startDate)} starts before the user joined the unit (${formatDate(unitJoinDate)})`);
			
			return;
		}
		if (duty.startDate > unitLeaveDate || duty.endDate > unitLeaveDate) {
			errorMessages.push(`The duty at ${formatDate(duty.startDate)} exceeds the user leaving the unit (${formatDate(unitLeaveDate)})`);
			
			return;
		}
		
		const periodAtDutyTime = user.periods.find((period) => (
			period.startDate < duty.startDate &&
			period.endDate > duty.endDate
		));
		
		if (!periodAtDutyTime) {
			errorMessages.push(`No period was found for duty at ${formatDate(duty.startDate)}`);
			
			return;
		}
		
		if (!checkIfRoleMatchDutyRequiredRole({
			role: periodAtDutyTime.role,
			dutyRoleRequirement: duty.role,
		})) {
			errorMessages.push(`At the duty in ${formatDate(duty.startDate)}, the user is at role ${periodAtDutyTime.role}, but the role requirement of the duty is ${duty.role}`);
			
			return;
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
				const errorMessages = getAllUserAssignmentsErrors({
					user,
				});
				
				const baseError: Omit<SanityCheckError, "message"> = {
					kind: SanityCheckErrorKind.ASSIGNMENT,
					userId: user.id,
					userFullName: user.firstName + " " + user.lastName,
				};
				
				for (const errorMessage of errorMessages) {
					yield JSON.stringify({
						message: errorMessage,
						...baseError,
					} satisfies SanityCheckError);
				}
			}
			
			// for (let i = 0; i < 3; i++) {
			// 	await new Promise((resolve) => setTimeout(resolve, 2_000));
			// 	yield i;
			// }
		}),
});
