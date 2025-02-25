import { z } from 'zod';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const AccountScalarFieldEnumSchema = z.enum(['id','userId','type','provider','providerAccountId','refresh_token','access_token','expires_at','token_type','scope','id_token','session_state','refresh_token_expires_in']);

export const SessionScalarFieldEnumSchema = z.enum(['id','sessionToken','userId','expires']);

export const UserScalarFieldEnumSchema = z.enum(['id','firstName','lastName','isAdmin','organizationId','phoneNumber','gender','rank','permanentEntryDate','registerDate','adminNote']);

export const VerificationTokenScalarFieldEnumSchema = z.enum(['identifier','token','expires']);

export const InvitationScalarFieldEnumSchema = z.enum(['inviteCode','userId','createDate','expireDate','redeemDate']);

export const OrganizationScalarFieldEnumSchema = z.enum(['id','name','description']);

export const DutyScalarFieldEnumSchema = z.enum(['id','kind','organizationId','startDate','endDate','requiredRoles','quantity','score','isPrivate','description']);

export const AssignmentScalarFieldEnumSchema = z.enum(['id','dutyId','assigneeId','reserveId','extraScore','note']);

export const PeriodScalarFieldEnumSchema = z.enum(['id','userId','role','status','startDate','endDate','description']);

export const PreferenceScalarFieldEnumSchema = z.enum(['id','userId','importance','startDate','endDate','description','kind']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const UserRoleSchema = z.enum(['SQUAD','OFFICER','COMMANDER','EXEMPT']);

export type UserRoleType = `${z.infer<typeof UserRoleSchema>}`

export const PeriodStatusSchema = z.enum(['FULFILLS_ROLE','TEMPORARILY_ABSENT','TEMPORARILY_EXEMPT']);

export type PeriodStatusType = `${z.infer<typeof PeriodStatusSchema>}`

export const DutyKindSchema = z.enum(['GUARDING','CAMP_DEFENSE','SETTLEMENTS_DEFENSE','KITCHEN','AGRICULTURE','FOOD_PACKAGING','OTHER']);

export type DutyKindType = `${z.infer<typeof DutyKindSchema>}`

export const PreferenceKindSchema = z.enum(['VACATION','MEDICAL','EDUCATION','APPOINTMENT','RELIGION','FAMILY_EVENT','CELEBRATION','OTHER']);

export type PreferenceKindType = `${z.infer<typeof PreferenceKindSchema>}`

export const PreferenceImportanceSchema = z.enum(['PREFERS','PREFERS_NOT_TO','CANT','HIGH_HESITATION']);

export type PreferenceImportanceType = `${z.infer<typeof PreferenceImportanceSchema>}`

export const UserRankSchema = z.enum(['PRIVATE','CORPORAL','SERGEANT','STAFF_SERGEANT','SERGEANT_FIRST_CLASS','MASTER_SERGEANT','PROFESSIONAL_ACADEMIC_OFFICER','SENIOR_ACADEMIC_OFFICER','SPECIAL_ACADEMIC_OFFICER','SECOND_LIEUTENANT','LIEUTENANT','CAPTAIN','MAJOR']);

export type UserRankType = `${z.infer<typeof UserRankSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  id: z.string().cuid2(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().nullable(),
  access_token: z.string().nullable(),
  expires_at: z.number().int().nullable(),
  token_type: z.string().nullable(),
  scope: z.string().nullable(),
  id_token: z.string().nullable(),
  session_state: z.string().nullable(),
  refresh_token_expires_in: z.number().int().nullable(),
})

export type Account = z.infer<typeof AccountSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  id: z.string().cuid2(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
})

export type Session = z.infer<typeof SessionSchema>

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  rank: UserRankSchema,
  id: z.string().cuid2(),
  firstName: z.string(),
  lastName: z.string(),
  isAdmin: z.boolean(),
  organizationId: z.string(),
  phoneNumber: z.string(),
  gender: z.string(),
  permanentEntryDate: z.coerce.date().nullable(),
  registerDate: z.coerce.date().nullable(),
  adminNote: z.string().nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// VERIFICATION TOKEN SCHEMA
/////////////////////////////////////////

export const VerificationTokenSchema = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
})

export type VerificationToken = z.infer<typeof VerificationTokenSchema>

/////////////////////////////////////////
// INVITATION SCHEMA
/////////////////////////////////////////

export const InvitationSchema = z.object({
  /**
   * The invite code sent to each user, which is used
   * to create an account
   */
  inviteCode: z.string().cuid2(),
  userId: z.string(),
  createDate: z.coerce.date(),
  expireDate: z.coerce.date(),
  redeemDate: z.coerce.date().nullable(),
})

export type Invitation = z.infer<typeof InvitationSchema>

/////////////////////////////////////////
// ORGANIZATION SCHEMA
/////////////////////////////////////////

export const OrganizationSchema = z.object({
  id: z.string().cuid2(),
  name: z.string(),
  description: z.string().nullable(),
})

export type Organization = z.infer<typeof OrganizationSchema>

/////////////////////////////////////////
// DUTY SCHEMA
/////////////////////////////////////////

export const DutySchema = z.object({
  kind: DutyKindSchema,
  requiredRoles: UserRoleSchema.array(),
  id: z.string().cuid2(),
  organizationId: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  quantity: z.number().int(),
  /**
   * The score granted to each assignee.
   * If the score is `-1`, grants default score based on the organization's policy
   */
  score: z.number().int(),
  isPrivate: z.boolean(),
  description: z.string().nullable(),
})

export type Duty = z.infer<typeof DutySchema>

/////////////////////////////////////////
// ASSIGNMENT SCHEMA
/////////////////////////////////////////

export const AssignmentSchema = z.object({
  id: z.string().cuid2(),
  dutyId: z.string(),
  assigneeId: z.string(),
  reserveId: z.string().nullable(),
  extraScore: z.number().int().nullable(),
  note: z.string().nullable(),
})

export type Assignment = z.infer<typeof AssignmentSchema>

/////////////////////////////////////////
// PERIOD SCHEMA
/////////////////////////////////////////

export const PeriodSchema = z.object({
  role: UserRoleSchema,
  status: PeriodStatusSchema,
  id: z.string().cuid2(),
  userId: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  description: z.string().nullable(),
})

export type Period = z.infer<typeof PeriodSchema>

/////////////////////////////////////////
// PREFERENCE SCHEMA
/////////////////////////////////////////

export const PreferenceSchema = z.object({
  importance: PreferenceImportanceSchema,
  kind: PreferenceKindSchema,
  id: z.string().cuid2(),
  userId: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  description: z.string(),
})

export type Preference = z.infer<typeof PreferenceSchema>
