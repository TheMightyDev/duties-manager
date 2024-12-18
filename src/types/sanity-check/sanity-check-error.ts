import { type SanityCheckErrorKind } from "@/types/sanity-check/sanity-check-error-kind";
import { type User } from "@prisma/client";

export interface SanityCheckError {
	kind: SanityCheckErrorKind;
	userId: User["id"];
	userFullName: string;
	message: string;
}
