import { PreferenceImportance } from "@prisma/client";

export const preferenceImportanceEmojis = {
	[PreferenceImportance.PREFERS]: "❤",
	[PreferenceImportance.PREFERS_NOT_TO]: "✋",
	[PreferenceImportance.CANT]: "",
	[PreferenceImportance.HIGH_HESITATION]: "⚠",
} as const satisfies Record<PreferenceImportance, string>;
