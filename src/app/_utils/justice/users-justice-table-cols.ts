import { type UserJustice } from "@/types/justice/user-justice";

export const usersJusticeTableColTitles = {
	userFullName: "שם",
	role: "תפקיד",
	weightedScore: "ניקוד משוקלל",
	monthsInRole: "מס' חודשים בתפקיד",
	weekdaysGuardingCount: "שמירות בימי חול",
	weekendsGuardingCount: "שמירות בסופ\"ש",
	otherDutiesScoreSum: "ניקוד תורנויות נוספות",
} as const satisfies Partial<Record<keyof UserJustice, string>>;

export type UserJusticeTableColId = keyof typeof usersJusticeTableColTitles;
