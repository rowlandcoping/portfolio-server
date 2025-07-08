/*
  Warnings:

  - Added the required column `personId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "personId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Personal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
