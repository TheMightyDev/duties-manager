import { PreferenceReason } from "@prisma/client";

export const preferenceReasonsEmojis = {
	[PreferenceReason.VACATION]: "🌴",
	[PreferenceReason.CELEBRATION]: "🎉",
	[PreferenceReason.FAMILY_EVENT]: "🌆",
	[PreferenceReason.EDUCATION]: "🎓",
	[PreferenceReason.MEDICAL]: "🏥",
	[PreferenceReason.RELIGION]: "🕍",
	[PreferenceReason.APPOINTMENT]: "🩺",
	[PreferenceReason.OTHER]: "📅",
} as const satisfies Record<PreferenceReason, string>;
