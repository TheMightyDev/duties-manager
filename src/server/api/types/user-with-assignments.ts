import { Prisma } from "@prisma/client";

export const userWithAssignmentsInclude = Prisma.validator<Prisma.UserInclude>()({
	assignments: {
		include: {
			duty: true,
		},
		orderBy: [
			{
				duty: {
					startDate: "desc",
				},
			},
		],
	},
});

export type UserWithAssignments = Prisma.UserGetPayload<{
	include: typeof userWithAssignmentsInclude;
}>;
