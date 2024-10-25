import { createId } from "@paralleldrive/cuid2";
import { type Exemption, ExemptionImpact } from "@prisma/client";

export const seedExemptions = [
	{
		id: createId(),
		userId: "omern",
		startDate: new Date(Date.UTC(2024, 5, 6, 0, 0, 0)),
		endDate: null,
		description: "הת\"ש 7 רפואי",
		impact: ExemptionImpact.NO_GUARDING,
	},
	{
		id: createId(),
		userId: "yuvala",
		startDate: new Date(Date.UTC(2024, 5, 6, 0, 0, 0)),
		endDate: null,
		description: "פטור משמירה",
		impact: ExemptionImpact.NO_GUARDING,
	},
] as const satisfies Exemption[];
