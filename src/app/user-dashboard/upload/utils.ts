import { type ParsedUserAndPeriods } from "@/app/user-dashboard/upload/types";
import { PeriodStatus, UserRank, UserRole } from "@prisma/client";

export function parseUserInfoStr(userInfoStr: string): ParsedUserAndPeriods {
	const splitData = userInfoStr.split("\t");
	
	const [
		rankInHebrew,
		firstName,
		lastName,
		genderOneHebrewLetter,
		roleInHebrew,
		roleStartDateStr,
		permanentEntryDateStr,
		retireDateStr,
		phoneNumber,
	] = splitData;
	
	const fullNameQuoted = `"${firstName} ${lastName}"`;
	
	if (
		!rankInHebrew ||
		!firstName ||
		!lastName ||
		!genderOneHebrewLetter ||
		!roleInHebrew ||
		!roleStartDateStr ||
		!permanentEntryDateStr ||
		!retireDateStr ||
		!phoneNumber
	) {
		throw new Error(`${fullNameQuoted} - One of the fields is empty - ${splitData.length} properties out of 9`);
	}
	
	if (!(hebrewGenders[genderOneHebrewLetter])) {
		throw new Error(`${fullNameQuoted} - Unknown gender "${genderOneHebrewLetter}"`);
	}
	
	const gender = hebrewGenders[genderOneHebrewLetter];
	
	if (!(hebrewRanks[rankInHebrew])) {
		throw new Error(`${fullNameQuoted} - Unknown rank "${rankInHebrew}"`);
	}
	
	const rank = hebrewRanks[rankInHebrew];
	
	if (!(hebrewRoles[roleInHebrew])) {
		throw new Error(`${fullNameQuoted} - Unknown role "${roleInHebrew}"`);
	}
	
	const role = hebrewRoles[roleInHebrew];
	
	const digitsInPhoneNumber = phoneNumber.length - (
		phoneNumber.includes("-") ? 1 : 0
	);
	
	if (digitsInPhoneNumber !== 10) {
		throw new Error(`${fullNameQuoted} - Invalid phone number (${phoneNumber}) - must be of format 05X-1234567 OR without dash 05X1234567`);
	}
	const permanentEntryDate = permanentEntryDateStr === "אין"
		? null
		: new Date(permanentEntryDateStr);
	
	/** Denotes if the user has a permanent service, but it hasn't started yet, and currently has the role squad */
	const isInRegularService = (
		permanentEntryDate !== null
		&& new Date() < permanentEntryDate
		&& role === UserRole.SQUAD
	);
	
	return {
		user: {
			rank,
			firstName,
			lastName,
			gender,
			phoneNumber,
			permanentEntryDate,
		},
		periods: isInRegularService ? [
			{
				startDate: new Date(roleStartDateStr),
				endDate: new Date(permanentEntryDateStr),
				role: UserRole.SQUAD,
				status: PeriodStatus.FULFILLS_ROLE,
				description: null,
			},
			{
				startDate: new Date(permanentEntryDateStr),
				endDate: new Date(retireDateStr),
				role: UserRole.OFFICER,
				status: PeriodStatus.FULFILLS_ROLE,
				description: null,
			},
		] : [
			{
				startDate: new Date(roleStartDateStr),
				endDate: new Date(retireDateStr),
				role,
				status: PeriodStatus.FULFILLS_ROLE,
				description: null,
			},
		],
	};
}

const hebrewGenders: Record<string, string> = {
	"ז": "male",
	"נ": "female",
} as const;

const hebrewRanks: Record<string, UserRank> = {
	"טוראי": UserRank.PRIVATE,
	"טור'": UserRank.PRIVATE,
	"טור": UserRank.PRIVATE,
	"רב\"ט": UserRank.CORPORAL,
	"רבט": UserRank.CORPORAL,
	"סמל": UserRank.SERGEANT,
	"סמ\"ר": UserRank.STAFF_SERGEANT,
	"סמר": UserRank.STAFF_SERGEANT,
	"רס\"ל": UserRank.SERGEANT_FIRST_CLASS,
	"רסל": UserRank.SERGEANT_FIRST_CLASS,
	"רס\"ר": UserRank.MASTER_SERGEANT,
	"רסר": UserRank.MASTER_SERGEANT,
	
	"קמ\"א": UserRank.PROFESSIONAL_ACADEMIC_OFFICER,
	"קמא": UserRank.PROFESSIONAL_ACADEMIC_OFFICER,
	"קא\"ב": UserRank.SENIOR_ACADEMIC_OFFICER,
	"קאב": UserRank.SENIOR_ACADEMIC_OFFICER,
	"קא\"מ": UserRank.SPECIAL_ACADEMIC_OFFICER,
	"קאמ": UserRank.SPECIAL_ACADEMIC_OFFICER,
	"קאם": UserRank.SPECIAL_ACADEMIC_OFFICER,
	
	"סג\"מ": UserRank.SECOND_LIEUTENANT,
	"סג\"ם": UserRank.SECOND_LIEUTENANT,
	"סגמ": UserRank.SECOND_LIEUTENANT,
	"סגם": UserRank.SECOND_LIEUTENANT,
	"סגן": UserRank.LIEUTENANT,
	"סרן": UserRank.CAPTAIN,
	"רס\"נ": UserRank.MAJOR,
	"רס\"ן": UserRank.MAJOR,
	"רסנ": UserRank.MAJOR,
	"רסן": UserRank.MAJOR,
} as const;

const hebrewRoles: Record<string, UserRole> = {
	"כיתה": UserRole.SQUAD,
	"כיתת": UserRole.SQUAD,
	"כיתת כוננות": UserRole.SQUAD,
	
	"קצין": UserRole.OFFICER,
	"קצין תורן": UserRole.OFFICER,
	
	"מפקד": UserRole.COMMANDER,
	"מפקד תורן": UserRole.COMMANDER,
	
	"פטור": UserRole.EXEMPT,
} as const;
