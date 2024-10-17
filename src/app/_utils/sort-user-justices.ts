import { type UserJustice } from "@/server/api/types/user-justice";

export function sortUserJusticesByWeightedScore({ userJustices, ascending }: {
	userJustices: UserJustice[];
	ascending: boolean;
}): UserJustice[] {
	const sorter = ascending
		? (a: UserJustice, b: UserJustice) => a.weightedScore - b.weightedScore
		: (a: UserJustice, b: UserJustice) => b.weightedScore - a.weightedScore;
		
	return userJustices.sort(sorter);
}
