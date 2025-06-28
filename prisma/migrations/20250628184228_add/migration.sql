/*
  Warnings:

  - You are about to drop the column `personalId` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Personal` table. All the data in the column will be lost.
  - You are about to drop the column `singleton` on the `Personal` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Personal` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ecoId,techId,personId]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Personal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_personalId_fkey";

-- DropIndex
DROP INDEX "Personal_singleton_key";

-- DropIndex
DROP INDEX "Skill_techId_personId_key";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "personalId",
ADD COLUMN     "personId" INTEGER;

-- AlterTable
ALTER TABLE "Personal" DROP COLUMN "name",
DROP COLUMN "singleton",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "userId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Personal_userId_key" ON "Personal"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_ecoId_techId_personId_key" ON "Skill"("ecoId", "techId", "personId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personal" ADD CONSTRAINT "Personal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Personal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
