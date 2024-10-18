import { z } from "zod";

import {
	createTRPCRouter,
	publicProcedure
} from "@/server/api/trpc";
import { type UserJustice } from "@/server/api/types/user-justice";
import { type UserWithExemptionsAndAbsences, userWithExemptionsAndAbsencesInclude } from "@/server/api/types/user-with-exemptions-and-absences";
import { DutyKind, type User, UserRole } from "@prisma/client";
import { differenceInDays } from "date-fns";

enum DutyKindForJustice {
	WEEKDAY_GUARDING,
	WEEKEND_GUARDING,
	OTHER,
}

function parseDutyKindForJustice({ kind: dutyKind, startDate, endDate }: {
	kind: DutyKind;
	startDate: Date;
	endDate: Date;
}): DutyKindForJustice {
	if (dutyKind === DutyKind.GUARDING) {
		const daysDiff = differenceInDays(endDate, startDate);

		return daysDiff < 2
			? DutyKindForJustice.WEEKDAY_GUARDING
			: DutyKindForJustice.WEEKEND_GUARDING;
	} else {
		return DutyKindForJustice.OTHER;
	}
}

function countTotalScore({ userJustice }: {
	userJustice: UserJustice;
}): number {
	const totalScore = (
		userJustice.weekdaysGuardingCount +
		userJustice.weekendsGuardingCount * 3 +
		userJustice.otherDutiesScoreSum
	);
	
	return totalScore;
}

function calcTotalMonthsInRole({
	userWithExemptionsAndAbsences,
	definitiveDate,
}: {
	userWithExemptionsAndAbsences: User & UserWithExemptionsAndAbsences;
	definitiveDate?: Date;
}): number {
	const actualDefinitiveDate = definitiveDate ?? new Date();
	const roleStartDate = userWithExemptionsAndAbsences.roleStartDate;
	
	const totalDaysSinceRoleStart = differenceInDays(actualDefinitiveDate, roleStartDate);
	
	const totalDaysMissing = userWithExemptionsAndAbsences.preferences.reduce((count, preference) => {
		if (preference.startDate < actualDefinitiveDate) {
			// There must be an end date because we filter out all permanent exemptions
			// (those that don't have an end date).
			// Note that absences cannot be permanent!
			const diffInDays = differenceInDays(
				preference.endDate! < actualDefinitiveDate ? preference.endDate! : actualDefinitiveDate,
				preference.startDate
			);
			
			return count + diffInDays;
		}
		
		return count;
	}, 0);
	
	const totalMonthsInRole = (totalDaysSinceRoleStart - totalDaysMissing) / 30;
	
	return totalMonthsInRole;
}

export const justiceRouter = createTRPCRouter({
	/** Returns all duties that either start or the end on the input month */
	getUsersJustice: publicProcedure
		.input(z.object({
			roles: z.array(z.nativeEnum(UserRole)),
			definitiveDate: z.date().optional(),
		}))
		.query((async ({ ctx, input: { roles, definitiveDate: _definitiveDate } }) => {
			const definitiveDate = _definitiveDate ?? new Date();
			
			const usersWithExemptionsAndAbsences = await ctx.db.user.findMany({
				include: userWithExemptionsAndAbsencesInclude,
				where: {
					role: {
						in: roles,
					},
				},
			});
			
			const usersWithAssignments = await ctx.db.user.findMany({
				include: {
					assignments: {
						where: {
							duty: {
								startDate: {
									lte: definitiveDate,
								},
							},
						},
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
				},
				where: {
					role: {
						in: roles,
					},
				},
			});
			
			const usersJustices = usersWithAssignments.map<UserJustice>((user) => {
				const monthsInRole = calcTotalMonthsInRole({
					// There must be a user with the given ID, because the `where` clause is the same in all queries
					userWithExemptionsAndAbsences: usersWithExemptionsAndAbsences.find((curr) => curr.id === user.id)!,
					definitiveDate,
				});
				
				const userJustice: UserJustice = {
					userId: user.id,
					monthsInRole,
					weekdaysGuardingCount: 0,
					weekendsGuardingCount: 0,
					otherDutiesScoreSum: 0,
					totalScore: 0,
					weightedScore: 0,
				};
				
				user.assignments.forEach((assignment) => {
					// Users can switch roles, assignments might refer to older role, we ignore such assignments
					if (assignment.duty.role !== user.role) {
						return;
					}
					
					const dutyKindForJustice = parseDutyKindForJustice(assignment.duty);
					
					if (dutyKindForJustice === DutyKindForJustice.WEEKDAY_GUARDING) {
						userJustice.weekdaysGuardingCount += 1;
					} else if (dutyKindForJustice === DutyKindForJustice.WEEKEND_GUARDING) {
						userJustice.weekendsGuardingCount += 1;
					} else {
						userJustice.otherDutiesScoreSum += assignment.duty.score;
					}
				});
				
				userJustice.totalScore = countTotalScore({
					userJustice,
				});
				
				userJustice.weightedScore = Number((userJustice.totalScore / userJustice.monthsInRole).toFixed(2));
				
				return userJustice;
			});
			
			return usersJustices;
		})),
});
