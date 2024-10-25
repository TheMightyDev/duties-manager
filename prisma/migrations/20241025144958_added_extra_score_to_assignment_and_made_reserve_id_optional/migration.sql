/*
  Warnings:

  - You are about to drop the column `userId` on the `Assignment` table. All the data in the column will be lost.
  - Added the required column `assigneeId` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_reserveId_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_userId_fkey";

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "userId",
ADD COLUMN     "assigneeId" TEXT NOT NULL,
ADD COLUMN     "extraScore" INTEGER,
ALTER COLUMN "reserveId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_reserveId_fkey" FOREIGN KEY ("reserveId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
