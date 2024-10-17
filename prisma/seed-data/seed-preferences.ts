import { createId } from "@paralleldrive/cuid2";
import { type Preference, PreferenceImportance, PreferenceReason } from "@prisma/client";
import { add, addDays, subDays } from "date-fns";
import { seedUsers } from "prisma/seed-data/seed-users";

export const seedPreferences = [
	{
		id: createId(),
		userId: seedUsers[0].id,
		startDate: subDays(new Date(), 20),
		endDate: null,
		reason: PreferenceReason.EXEMPTION,
		description: "הת\"ש 7 רפואי",
		importance: PreferenceImportance.NO_GUARDING,
	},
	{
		id: createId(),
		userId: seedUsers[0].id,
		startDate: addDays(new Date(), 20),
		endDate: addDays(new Date(), 25),
		reason: PreferenceReason.VACATION,
		description: "אני טס ליוון",
		importance: PreferenceImportance.HIGH_PRIORITY_NOT_TO,
	},
	
	{
		id: createId(),
		userId: seedUsers[1].id,
		startDate: add(new Date(), {
			days: 10,
			hours: 15,
		}),
		endDate: add(new Date(), {
			days: 11,
			hours: 20,
		}),
		reason: PreferenceReason.RELIGION,
		description: "מעדיף לא בשל צום גדליה",
		importance: PreferenceImportance.PREFERS_NOT_TO,
	},
	{
		id: createId(),
		userId: seedUsers[1].id,
		startDate: addDays(new Date(), 21),
		endDate: addDays(new Date(), 21),
		reason: PreferenceReason.EDUCATION,
		description: "יש לי מבחן באינפי",
		importance: PreferenceImportance.NORMAL_PRIORITY_NOT_TO,
	},
	{
		id: createId(),
		userId: seedUsers[3].id,
		startDate: addDays(new Date(), 10),
		endDate: addDays(new Date(), 10),
		reason: PreferenceReason.MEDICAL,
		description: "תור חשוב לרופא שאני לא רוצה לפספס",
		importance: PreferenceImportance.PREFERS_NOT_TO,
	},
	{
		id: createId(),
		userId: seedUsers[3].id,
		startDate: addDays(new Date(), 40),
		endDate: addDays(new Date(), 40),
		reason: PreferenceReason.CELEBRATION,
		description: "יום הולדת לחבר קרוב",
		importance: PreferenceImportance.PREFERS_NOT_TO,
	},
	{
		id: createId(),
		userId: seedUsers[5].id,
		startDate: addDays(new Date(), 4),
		endDate: addDays(new Date(), 4),
		reason: PreferenceReason.CELEBRATION,
		description: "יש לי יום הולדת",
		importance: PreferenceImportance.HIGH_PRIORITY_NOT_TO,
	},
	{
		id: createId(),
		userId: seedUsers[4].id,
		startDate: addDays(new Date(), 20),
		endDate: addDays(new Date(), 20),
		reason: PreferenceReason.FAMILY_EVENT,
		description: "אזכרה של סבא",
		importance: PreferenceImportance.NORMAL_PRIORITY_NOT_TO,
	},
	{
		id: createId(),
		userId: seedUsers[4].id,
		startDate: addDays(new Date(), 21),
		endDate: addDays(new Date(), 22),
		reason: PreferenceReason.CELEBRATION,
		description: "פסטיבל התמר",
		importance: PreferenceImportance.HIGH_PRIORITY_NOT_TO,
	},
	{
		id: createId(),
		userId: seedUsers[1].id,
		startDate: addDays(new Date(), 50),
		endDate: addDays(new Date(), 50),
		reason: PreferenceReason.FAMILY_EVENT,
		description: "מסיבת גיוס לאחותי",
		importance: PreferenceImportance.NORMAL_PRIORITY_NOT_TO,
	},
] as const satisfies Preference[];
