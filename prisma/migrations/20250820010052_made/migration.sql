/*
  Warnings:

  - Made the column `ecoId` on table `Tech` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Tech" DROP CONSTRAINT "Tech_ecoId_fkey";

-- AlterTable
ALTER TABLE "public"."Tech" ALTER COLUMN "ecoId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Tech" ADD CONSTRAINT "Tech_ecoId_fkey" FOREIGN KEY ("ecoId") REFERENCES "public"."Ecosystem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
