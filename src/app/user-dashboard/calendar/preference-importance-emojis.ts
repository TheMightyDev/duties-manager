import { PreferenceImportance } from "@prisma/client";

export const preferenceImportanceEmojis = {
	[PreferenceImportance.PREFERS]: "❤",
	[PreferenceImportance.PREFERS_NOT_TO]: "✋",
	[PreferenceImportance.NORMAL_PRIORITY_NOT_TO]: "",
	[PreferenceImportance.HIGH_PRIORITY_NOT_TO]: "⚠",
	[PreferenceImportance.EASE_GUARDING]: "😌",
	[PreferenceImportance.NO_GUARDING]: "☺",
	[PreferenceImportance.ABSENT]: "⛵",
} as const satisfies Record<PreferenceImportance, string>;
