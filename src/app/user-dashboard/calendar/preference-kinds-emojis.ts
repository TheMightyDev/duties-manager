import { PreferenceKind } from "@prisma/client";

export const preferenceKindsEmojis = {
	[PreferenceKind.VACATION]: "🌴",
	[PreferenceKind.CELEBRATION]: "🎉",
	[PreferenceKind.FAMILY_EVENT]: "🌆",
	[PreferenceKind.EDUCATION]: "🎓",
	[PreferenceKind.MEDICAL]: "🏥",
	[PreferenceKind.RELIGION]: "🕍",
	[PreferenceKind.APPOINTMENT]: "🩺",
	[PreferenceKind.OTHER]: "📅",
} as const satisfies Record<PreferenceKind, string>;
