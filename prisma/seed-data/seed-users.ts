import { type User, UserRank } from "@prisma/client";
import { seedOrganizations } from "prisma/seed-data/seed-organizations";

export const seedUsers = [
	{
		id: "ofeks",
		firstName: "אופק",
		lastName: "אסולין",
		organizationId: seedOrganizations[0].id,
		phoneNumber: "0501234567",
		rank: UserRank.CORPORAL,
		gender: "male",
		permanentEntryDate: new Date(2026, 6, 7),
		registerDate: null,
		isAdmin: true,
	},
	{
		id: "valerik",
		firstName: "ולרי",
		lastName: "קמנסקי",
		organizationId: seedOrganizations[0].id,
		phoneNumber: "0524752232",
		rank: UserRank.STAFF_SERGEANT,
		gender: "male",
		permanentEntryDate: new Date(2025, 1, 19),
		registerDate: null,
		isAdmin: false,
	},
	{
		id: "ronis",
		firstName: "רוני",
		lastName: "שמואלי",
		organizationId: seedOrganizations[0].id,
		phoneNumber: "0547481081",
		rank: UserRank.SERGEANT,
		gender: "female",
		permanentEntryDate: null,
		registerDate: null,
		isAdmin: false,
	},
	{
		id: "roim",
		firstName: "רועי",
		lastName: "מקיטון",
		organizationId: seedOrganizations[0].id,
		phoneNumber: "0547405415",
		rank: UserRank.PRIVATE,
		gender: "male",
		permanentEntryDate: new Date(2027, 1, 18),
		registerDate: null,
		isAdmin: false,
	},
	{
		id: "netam",
		firstName: "נטע",
		lastName: "מור",
		organizationId: seedOrganizations[0].id,
		phoneNumber: "0542139957",
		rank: UserRank.SERGEANT,
		gender: "female",
		permanentEntryDate: null,
		registerDate: null,
		isAdmin: false,
	},
	{
		id: "bars",
		firstName: "בר",
		lastName: "שדמי",
		organizationId: seedOrganizations[0].id,
		phoneNumber: "0584704708",
		rank: UserRank.SERGEANT,
		gender: "male",
		permanentEntryDate: null,
		registerDate: null,
		isAdmin: false,
	},
	{
		id: "shania",
		firstName: "שני",
		lastName: "ארנון",
		organizationId: seedOrganizations[0].id,
		phoneNumber: "0535450101",
		rank: UserRank.PRIVATE,
		gender: "male",
		permanentEntryDate: new Date(2026, 5, 18),
		registerDate: null,
		isAdmin: false,
	},
	{
		id: "agams",
		firstName: "אגם",
		lastName: "סגל",
		organizationId: seedOrganizations[0].id,
		phoneNumber: "0548033079",
		rank: UserRank.PROFESSIONAL_ACADEMIC_OFFICER,
		gender: "male",
		permanentEntryDate: new Date(2027, 0, 6),
		registerDate: null,
		isAdmin: false,
	},
	{
		id: "noams",
		firstName: "נועם",
		lastName: "שחמון",
		organizationId: seedOrganizations[0].id,
		phoneNumber: "0528773148",
		rank: UserRank.LIEUTENANT,
		gender: "female",
		permanentEntryDate: new Date(2023, 10, 24),
		registerDate: null,
		isAdmin: false,
	},
	{
		id: "shachars",
		firstName: "שחר",
		lastName: "משה",
		organizationId: seedOrganizations[0].id,
		phoneNumber: "0547982477",
		rank: UserRank.LIEUTENANT,
		gender: "male",
		permanentEntryDate: new Date(2025, 2, 27),
		registerDate: null,
		isAdmin: false,
	},
	{
		id: "omern",
		firstName: "עומר",
		lastName: "נפתלי",
		organizationId: seedOrganizations[0].id,
		phoneNumber: "0528617814",
		rank: UserRank.PROFESSIONAL_ACADEMIC_OFFICER,
		gender: "male",
		permanentEntryDate: new Date(2025, 4, 15),
		registerDate: null,
		isAdmin: false,
	},
	{
		id: "yuvala",
		firstName: "יובל",
		lastName: "ערוסי",
		organizationId: seedOrganizations[0].id,
		phoneNumber: "0587503888",
		rank: UserRank.SERGEANT,
		gender: "male",
		permanentEntryDate: null,
		registerDate: null,
		isAdmin: false,
	},
] as const satisfies User[];
