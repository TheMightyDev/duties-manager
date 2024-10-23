/*
  Warnings:

  - Made the column `endDate` on table `Preference` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Exemption" ALTER COLUMN "endDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Preference" ALTER COLUMN "endDate" SET NOT NULL;
