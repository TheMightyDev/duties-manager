import { PreferenceImportance } from "@prisma/client";

export const preferenceImportanceEmojis = {
	[PreferenceImportance.ABSENT]: "⛵",
	[PreferenceImportance.HIGH_PRIORITY]: "⚠",
	[PreferenceImportance.NORMAL_PRIORITY]: "",
	[PreferenceImportance.PREFERS_NOT_TO]: "✋",
} as const satisfies Record<PreferenceImportance, string>;
