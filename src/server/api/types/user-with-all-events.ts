import { PeriodStatus, Prisma, type User } from "@prisma/client";

const assignmentWithDutyInclude = Prisma.validator<Prisma.AssignmentInclude>()({
	duty: {
		select: {
			id: true,
			kind: true,
			role: true,
			score: true,
			description: true,
			startDate: true,
			endDate: true,
		},
	},
});

/** Include a user with all their events so it could be later parsed to display in calendar:
 * - Duty assignments (including reserves)
 * - Preferences
 * - Temporary Exemptions (Permanent exemptions are not visible in calendar)
 * - Absences.
 */
export const userWithAllEventsInclude = Prisma.validator<Prisma.UserInclude>()({
	assignments: {
		include: assignmentWithDutyInclude,
	},
	reserves: {
		include: assignmentWithDutyInclude,
	},
	periods: {
		where: {
			status: {
				in: [
					PeriodStatus.TEMPORARILY_ABSENT,
					// We find temporary exemptions of 2 kinds in
					// the exemptions table: those that can ease
					// guarding and one that completely frees from guarding.
					// to avoid duplicate events (desired in the DB, but not in
					// this case), we get only absence periods from
				],
			},
		},
	},
	exemptions: {
		where: {
			endDate: {
				not: null,
			},
		},
	},
	preferences: {
		select: {
			id: true,
			kind: true,
			importance: true,
			description: true,
			startDate: true,
			endDate: true,
		},
	},
});

export type UserWithAllEvents = User & Prisma.UserGetPayload<{
	include: typeof userWithAllEventsInclude;
}>;
