/*
  Warnings:

  - You are about to drop the `Exemption` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Exemption" DROP CONSTRAINT "Exemption_userId_fkey";

-- DropTable
DROP TABLE "Exemption";

-- DropEnum
DROP TYPE "ExemptionImpact";
