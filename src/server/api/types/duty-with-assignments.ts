import { Prisma } from "@prisma/client";

export const dutyWithAssignmentsInclude = Prisma.validator<Prisma.DutyInclude>()({
	assignments: {
		include: {
			assignee: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
				},
			},
			reserve: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
				},
			},
		},
	},
});

export type DutyWithAssignments = Prisma.DutyGetPayload<{
	include: typeof dutyWithAssignmentsInclude;
}>;
