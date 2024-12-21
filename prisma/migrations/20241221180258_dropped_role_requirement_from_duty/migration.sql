/*
  Warnings:

  - You are about to drop the column `roleRequirement` on the `Duty` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Duty" DROP COLUMN "roleRequirement";

-- DropEnum
DROP TYPE "DutyRoleRequirement";
