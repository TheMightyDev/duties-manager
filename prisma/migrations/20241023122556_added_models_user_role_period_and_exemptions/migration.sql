/*
  Warnings:

  - The values [NORMAL_PRIORITY_NOT_TO,HIGH_PRIORITY_NOT_TO,EASE_GUARDING,NO_GUARDING,NO_DUTIES] on the enum `PreferenceImportance` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `reason` on the `Preference` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `retireDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `roleStartDate` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `kind` to the `Preference` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PeriodStatus" AS ENUM ('FULFILLS_ROLE', 'TEMPORARILY_ABSENT', 'TEMPORARILY_EXEMPT');

-- CreateEnum
CREATE TYPE "PreferenceKind" AS ENUM ('VACATION', 'MEDICAL', 'EDUCATION', 'APPOINTMENT', 'RELIGION', 'FAMILY_EVENT', 'CELEBRATION', 'OTHER');

-- CreateEnum
CREATE TYPE "ExemptionImpact" AS ENUM ('EASE_GUARDING', 'NO_GUARDING', 'NO_DUTIES');

-- AlterEnum
BEGIN;
CREATE TYPE "PreferenceImportance_new" AS ENUM ('PREFERS', 'PREFERS_NOT_TO', 'CANT', 'HIGH_HESITATION');
ALTER TABLE "Preference" ALTER COLUMN "importance" TYPE "PreferenceImportance_new" USING ("importance"::text::"PreferenceImportance_new");
ALTER TYPE "PreferenceImportance" RENAME TO "PreferenceImportance_old";
ALTER TYPE "PreferenceImportance_new" RENAME TO "PreferenceImportance";
DROP TYPE "PreferenceImportance_old";
COMMIT;

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Preference" DROP COLUMN "reason",
ADD COLUMN     "kind" "PreferenceKind" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "emailVerified",
DROP COLUMN "retireDate",
DROP COLUMN "role",
DROP COLUMN "roleStartDate",
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "registerDate" TIMESTAMP(3);

-- DropEnum
DROP TYPE "PreferenceReason";

-- CreateTable
CREATE TABLE "Period" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "status" "PeriodStatus" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Period_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exemption" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "impact" "ExemptionImpact" NOT NULL,

    CONSTRAINT "Exemption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- AddForeignKey
ALTER TABLE "Period" ADD CONSTRAINT "Period_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exemption" ADD CONSTRAINT "Exemption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
