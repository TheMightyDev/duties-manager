import { type UserJustice } from "@/app/_types/justice/user-justice";
import {
	createTRPCRouter,
	publicProcedure
} from "@/server/api/trpc";
import { type UserWithExemptionsAndAbsences } from "@/server/api/types/user-with-exemptions-and-absences";
import { DutyKind, PreferenceImportance, PreferenceReason, type User, UserRole } from "@prisma/client";
import { differenceInDays } from "date-fns";
import { z } from "zod";

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
	
	return Number(totalMonthsInRole.toFixed(2));
}

export const justiceRouter = createTRPCRouter({
	/** Returns all duties that either start or the end on the input month */
	getUsersJustice: publicProcedure
		.input(z
			.object({
				roles: z.array(z.nativeEnum(UserRole)),
				userIds: z.array(z.string()),
				definitiveDate: z.date().optional(),
			})
			.partial()
			.refine(
				(data) => (Boolean(data.roles) || Boolean(data.userIds)) && !(Boolean(data.roles) && Boolean(data.userIds)),
				"Either roles or userIds should be filled in."
			))
		.query((async ({
			ctx, input: {
				roles,
				userIds,
				definitiveDate: _definitiveDate,
			},
		}) => {
			const definitiveDate = _definitiveDate ?? new Date();
			
			const relevantUsers = await ctx.db.user.findMany({
				include: {
					preferences: {
						where: {
							OR: [
								{
									reason: PreferenceReason.EXEMPTION,
									importance: {
										in: [ PreferenceImportance.NO_GUARDING, PreferenceImportance.NO_DUTIES ],
									},
									endDate: {
										not: null,
									},
								},
								{
									reason: PreferenceReason.ABSENCE,
								},
							],
						},
					},
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
					OR: [
						{
							role: {
								in: roles,
							},
						},
						{
							id: {
								in: userIds,
							},
						},
					],
					roleStartDate: {
						lte: definitiveDate,
					},
					retireDate: {
						gte: definitiveDate,
					},
				},
			});
			
			const usersJustices = relevantUsers.map<UserJustice>((user) => {
				const monthsInRole = calcTotalMonthsInRole({
					userWithExemptionsAndAbsences: user,
					definitiveDate,
				});
				
				const userJustice: UserJustice = {
					userId: user.id,
					userFullName: user.firstName + " " + user.lastName,
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
