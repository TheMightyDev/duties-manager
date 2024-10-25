import { createId } from "@paralleldrive/cuid2";
import { type Period, PeriodStatus, UserRole } from "@prisma/client";

export const seedPeriods = [
	{
		id: createId(),
		userId: "ofeks",
		startDate: new Date(Date.UTC(2023, 10, 23, 0, 0, 0)),
		endDate: new Date(Date.UTC(2028, 0, 5, 0, 0, 0)),
		role: UserRole.EXEMPT,
		status: PeriodStatus.FULFILLS_ROLE,
		description: null,
	},
	{
		id: createId(),
		userId: "valerik",
		startDate: new Date(Date.UTC(2023, 7, 1, 0, 0, 0)),
		endDate: new Date(Date.UTC(2025, 1, 19, 0, 0, 0)),
		role: UserRole.SQUAD,
		status: PeriodStatus.FULFILLS_ROLE,
		description: null,
	},
	{
		id: createId(),
		userId: "valerik",
		startDate: new Date(Date.UTC(2025, 1, 20, 0, 0, 0)),
		endDate: new Date(Date.UTC(2026, 5, 17, 0, 0, 0)),
		role: UserRole.OFFICER,
		status: PeriodStatus.FULFILLS_ROLE,
		description: null,
	},
	{
		id: createId(),
		userId: "ronis",
		startDate: new Date(Date.UTC(2023, 7, 1, 0, 0, 0)),
		endDate: new Date(Date.UTC(2024, 0, 4, 0, 0, 0)),
		role: UserRole.SQUAD,
		status: PeriodStatus.FULFILLS_ROLE,
		description: null,
	},
	{
		id: createId(),
		userId: "ronis",
		startDate: new Date(Date.UTC(2024, 0, 5, 0, 0, 0)),
		endDate: new Date(Date.UTC(2024, 5, 6, 0, 0, 0)),
		role: UserRole.SQUAD,
		status: PeriodStatus.TEMPORARILY_ABSENT,
		description: "פיקוד בקורס פס\"י",
	},
	{
		id: createId(),
		userId: "ronis",
		startDate: new Date(Date.UTC(2024, 5, 7, 0, 0, 0)),
		endDate: new Date(Date.UTC(2024, 10, 4, 0, 0, 0)),
		role: UserRole.SQUAD,
		status: PeriodStatus.FULFILLS_ROLE,
		description: null,
	},
	{
		id: createId(),
		userId: "ronis",
		startDate: new Date(Date.UTC(2024, 10, 5, 0, 0, 0)),
		endDate: new Date(Date.UTC(2025, 4, 6, 0, 0, 0)),
		role: UserRole.SQUAD,
		status: PeriodStatus.TEMPORARILY_ABSENT,
		description: "קורס קצינים",
	},
	{
		id: createId(),
		userId: "ronis",
		startDate: new Date(Date.UTC(2025, 4, 7, 0, 0, 0)),
		endDate: new Date(Date.UTC(2027, 2, 20, 0, 0, 0)),
		role: UserRole.COMMANDER,
		status: PeriodStatus.FULFILLS_ROLE,
		description: null,
	},
	{
		id: createId(),
		userId: "roim",
		startDate: new Date(Date.UTC(2024, 6, 16, 0, 0, 0)),
		endDate: new Date(Date.UTC(2027, 1, 18, 0, 0, 0)),
		role: UserRole.SQUAD,
		status: PeriodStatus.FULFILLS_ROLE,
		description: null,
	},
	{
		id: createId(),
		userId: "netam",
		startDate: new Date(Date.UTC(2023, 7, 1, 0, 0, 0)),
		endDate: new Date(Date.UTC(2025, 1, 13, 0, 0, 0)),
		role: UserRole.SQUAD,
		status: PeriodStatus.FULFILLS_ROLE,
		description: null,
	},
	{
		id: createId(),
		userId: "bars",
		startDate: new Date(Date.UTC(2023, 7, 1, 0, 0, 0)),
		endDate: new Date(Date.UTC(2025, 9, 14, 0, 0, 0)),
		role: UserRole.SQUAD,
		status: PeriodStatus.FULFILLS_ROLE,
		description: null,
	},
	{
		id: createId(),
		userId: "shania",
		startDate: new Date(Date.UTC(2024, 6, 16, 0, 0, 0)),
		endDate: new Date(Date.UTC(2027, 1, 18, 0, 0, 0)),
		role: UserRole.SQUAD,
		status: PeriodStatus.FULFILLS_ROLE,
		description: null,
	},
	{
		id: createId(),
		userId: "agams",
		startDate: new Date(Date.UTC(2024, 5, 16, 0, 0, 0)),
		endDate: new Date(Date.UTC(2029, 0, 4, 0, 0, 0)),
		role: UserRole.OFFICER,
		status: PeriodStatus.FULFILLS_ROLE,
		description: null,
	},
	{
		id: createId(),
		userId: "noams",
		startDate: new Date(Date.UTC(2023, 7, 1, 0, 0, 0)),
		endDate: new Date(Date.UTC(2023, 10, 23, 0, 0, 0)),
		role: UserRole.OFFICER,
		status: PeriodStatus.FULFILLS_ROLE,
		description: null,
	},
	{
		id: createId(),
		userId: "noams",
		startDate: new Date(Date.UTC(2023, 10, 24, 0, 0, 0)),
		endDate: new Date(Date.UTC(2025, 0, 14, 0, 0, 0)),
		role: UserRole.COMMANDER,
		status: PeriodStatus.FULFILLS_ROLE,
		description: null,
	},
	{
		id: createId(),
		userId: "shachars",
		startDate: new Date(Date.UTC(2023, 6, 2, 0, 0, 0)),
		endDate: new Date(Date.UTC(2028, 2, 26, 0, 0, 0)),
		role: UserRole.COMMANDER,
		status: PeriodStatus.FULFILLS_ROLE,
		description: null,
	},
	{
		id: createId(),
		userId: "omern",
		startDate: new Date(Date.UTC(2023, 6, 2, 0, 0, 0)),
		endDate: new Date(Date.UTC(2024, 1, 18, 0, 0, 0)),
		role: UserRole.OFFICER,
		status: PeriodStatus.FULFILLS_ROLE,
		description: null,
	},
	{
		id: createId(),
		userId: "omern",
		startDate: new Date(Date.UTC(2024, 1, 19, 0, 0, 0)),
		endDate: new Date(Date.UTC(2028, 2, 26, 0, 0, 0)),
		role: UserRole.EXEMPT,
		status: PeriodStatus.FULFILLS_ROLE,
		description: null,
	},
	{
		id: createId(),
		userId: "yuvala",
		startDate: new Date(Date.UTC(2024, 5, 6, 0, 0, 0)),
		endDate: new Date(Date.UTC(2025, 7, 27, 0, 0, 0)),
		role: UserRole.EXEMPT,
		status: PeriodStatus.FULFILLS_ROLE,
		description: null,
	},
] as const satisfies Period[];
