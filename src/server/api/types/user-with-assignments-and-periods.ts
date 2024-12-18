import { Prisma } from "@prisma/client";

export const userWithAssignmentsAndPeriodsInclude = Prisma.validator<Prisma.UserInclude>()({
	periods: {
		orderBy: {
			startDate: "asc",
		},
	},
	assignments: {
		include: {
			duty: true,
		},
		orderBy: [
			{
				duty: {
					startDate: "asc",
				},
			},
		],
	},
});

export type UserWithAssignmentsAndPeriods = Prisma.UserGetPayload<{
	include: typeof userWithAssignmentsAndPeriodsInclude;
}>;
