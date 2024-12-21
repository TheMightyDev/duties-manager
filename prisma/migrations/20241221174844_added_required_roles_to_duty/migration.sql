-- AlterTable
ALTER TABLE "Duty" ADD COLUMN     "requiredRoles" "UserRole"[] DEFAULT ARRAY[]::"UserRole"[],
ALTER COLUMN "score" SET DEFAULT -1,
ALTER COLUMN "roleRequirement" DROP NOT NULL,
ALTER COLUMN "roleRequirement" DROP DEFAULT;
