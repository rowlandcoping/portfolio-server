/*
  Warnings:

  - You are about to drop the column `competency` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `techId` on the `Skill` table. All the data in the column will be lost.
  - Made the column `ecoId` on table `Skill` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Skill" DROP CONSTRAINT "Skill_techId_fkey";

-- DropIndex
DROP INDEX "public"."Skill_techId_personId_key";

-- AlterTable
ALTER TABLE "public"."Skill" DROP COLUMN "competency",
DROP COLUMN "techId",
ALTER COLUMN "ecoId" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Tech" ADD COLUMN     "ecoId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Tech" ADD CONSTRAINT "Tech_ecoId_fkey" FOREIGN KEY ("ecoId") REFERENCES "public"."Ecosystem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
