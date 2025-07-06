/*
  Warnings:

  - A unique constraint covering the columns `[ecoId,personId]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[techId,personId]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Skill_ecoId_techId_personId_key";

-- AlterTable
ALTER TABLE "Skill" ALTER COLUMN "ecoId" DROP NOT NULL,
ALTER COLUMN "techId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Skill_ecoId_personId_key" ON "Skill"("ecoId", "personId");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_techId_personId_key" ON "Skill"("techId", "personId");
