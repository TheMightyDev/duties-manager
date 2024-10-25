import { createId } from "@paralleldrive/cuid2";
import { type Preference, PreferenceImportance, PreferenceKind } from "@prisma/client";
import { add, addDays } from "date-fns";
import { seedUsers } from "prisma/seed-data/seed-users";

export const seedPreferences = [
	{
		id: createId(),
		userId: seedUsers[0].id,
		startDate: addDays(new Date(), 20),
		endDate: addDays(new Date(), 25),
		kind: PreferenceKind.VACATION,
		description: "אני טס ליוון",
		importance: PreferenceImportance.HIGH_HESITATION,
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
		kind: PreferenceKind.RELIGION,
		description: "מעדיף לא בשל צום גדליה",
		importance: PreferenceImportance.PREFERS_NOT_TO,
	},
	{
		id: createId(),
		userId: seedUsers[1].id,
		startDate: addDays(new Date(), 21),
		endDate: addDays(new Date(), 21),
		kind: PreferenceKind.EDUCATION,
		description: "יש לי מבחן באינפי",
		importance: PreferenceImportance.CANT,
	},
	{
		id: createId(),
		userId: seedUsers[3].id,
		startDate: addDays(new Date(), 10),
		endDate: addDays(new Date(), 10),
		kind: PreferenceKind.MEDICAL,
		description: "תור חשוב לרופא שאני לא רוצה לפספס",
		importance: PreferenceImportance.PREFERS_NOT_TO,
	},
	{
		id: createId(),
		userId: seedUsers[3].id,
		startDate: addDays(new Date(), 40),
		endDate: addDays(new Date(), 40),
		kind: PreferenceKind.CELEBRATION,
		description: "יום הולדת לחבר קרוב",
		importance: PreferenceImportance.PREFERS_NOT_TO,
	},
	{
		id: createId(),
		userId: seedUsers[5].id,
		startDate: addDays(new Date(), 4),
		endDate: addDays(new Date(), 4),
		kind: PreferenceKind.CELEBRATION,
		description: "יש לי יום הולדת",
		importance: PreferenceImportance.HIGH_HESITATION,
	},
	{
		id: createId(),
		userId: seedUsers[4].id,
		startDate: addDays(new Date(), 20),
		endDate: addDays(new Date(), 20),
		kind: PreferenceKind.FAMILY_EVENT,
		description: "אזכרה של סבא",
		importance: PreferenceImportance.CANT,
	},
	{
		id: createId(),
		userId: seedUsers[4].id,
		startDate: addDays(new Date(), 21),
		endDate: addDays(new Date(), 22),
		kind: PreferenceKind.CELEBRATION,
		description: "פסטיבל התמר",
		importance: PreferenceImportance.HIGH_HESITATION,
	},
	{
		id: createId(),
		userId: seedUsers[1].id,
		startDate: addDays(new Date(), 50),
		endDate: addDays(new Date(), 50),
		kind: PreferenceKind.FAMILY_EVENT,
		description: "מסיבת גיוס לאחותי",
		importance: PreferenceImportance.CANT,
	},
] as const satisfies Preference[];
