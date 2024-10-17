/*
  Warnings:

  - The values [ABSENT] on the enum `PreferenceImportance` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PreferenceImportance_new" AS ENUM ('PREFERS', 'PREFERS_NOT_TO', 'NORMAL_PRIORITY_NOT_TO', 'HIGH_PRIORITY_NOT_TO', 'EASE_GUARDING', 'NO_GUARDING', 'NO_DUTIES');
ALTER TABLE "Preference" ALTER COLUMN "importance" TYPE "PreferenceImportance_new" USING ("importance"::text::"PreferenceImportance_new");
ALTER TYPE "PreferenceImportance" RENAME TO "PreferenceImportance_old";
ALTER TYPE "PreferenceImportance_new" RENAME TO "PreferenceImportance";
DROP TYPE "PreferenceImportance_old";
COMMIT;

-- AlterEnum
ALTER TYPE "PreferenceReason" ADD VALUE 'ABSENCE';
