import { Prisma } from "@prisma/client";

export const userWithPeriodsAndAssignmentsInclude = Prisma.validator<Prisma.UserInclude>()({
	periods: {
		select: {
			startDate: true,
			endDate: true,
			role: true,
			status: true,
		},
		orderBy: [
			{
				startDate: "asc",
			},
		],
	},
	assignments: {
		include: {
			duty: {
				select: {
					startDate: true,
					endDate: true,
					score: true,
					kind: true,
				},
			},
		},
	},
});

export type UserWithPeriodsAndAssignments = Prisma.UserGetPayload<{
	include: typeof userWithPeriodsAndAssignmentsInclude;
}>;
