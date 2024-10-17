import { Prisma } from "@prisma/client";

export const userWithAssignmentsInclude = Prisma.validator<Prisma.UserInclude>()({
	assignments: {
		include: {
			duty: {
				select: {
					kind: true,
					role: true,
					score: true,
					startDate: true,
					endDate: true,
				},
			},
		},
	},
});

export type UserWithAssignments = Prisma.UserGetPayload<{
	include: typeof userWithAssignmentsInclude;
}>;
