/*
  Warnings:

  - Added the required column `rank` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRank" AS ENUM ('PRIVATE', 'CORPORAL', 'SERGEANT', 'STAFF_SERGEANT', 'SERGEANT_FIRST_CLASS', 'MASTER_SERGEANT', 'PROFESSIONAL_ACADEMIC_OFFICER', 'SENIOR_ACADEMIC_OFFICER', 'SPECIAL_ACADEMIC_OFFICER', 'SECOND_LIEUTENANT', 'LIEUTENANT', 'CAPTAIN', 'MAJOR');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rank" "UserRank" NOT NULL;
