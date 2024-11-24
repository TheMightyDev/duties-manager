import { type Period, type User, UserRank } from "@prisma/client";

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

interface UserInfoStrToInsertedDateReturn {
	user: Omit<User, "id" | "isAdmin" | "organizationId" | "registerDate">;
	periods: (Omit<Period, "id">)[];
}
export function userInfoStrToInsertedDate(userInfoStr: string): UserInfoStrToInsertedDateReturn {
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
	] = userInfoStr.split(" ");
	
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
		throw new Error("Some field is missing");
	}
	
	if (!(hebrewGenders[genderOneHebrewLetter])) {
		throw new Error(`Unknown gender "${genderOneHebrewLetter}" for "${firstName} ${lastName}"`);
	}
	
	if (!(hebrewRanks[rankInHebrew])) {
		throw new Error(`Unknown rank "${rankInHebrew}" for "${firstName} ${lastName}"`);
	}
	
	return {
		user: {
			rank: hebrewRanks[rankInHebrew],
			firstName,
			lastName,
			gender: hebrewGenders[ genderOneHebrewLetter],
			
		},
		periods: [],
	};
}
