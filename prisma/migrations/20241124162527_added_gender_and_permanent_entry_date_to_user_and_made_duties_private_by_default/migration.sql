/*
  Warnings:

  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Duty" ALTER COLUMN "isPrivate" SET DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "permanentEntryDate" TIMESTAMP(3);
