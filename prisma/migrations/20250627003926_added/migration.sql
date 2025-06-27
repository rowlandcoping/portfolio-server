/*
  Warnings:

  - Added the required column `description` to the `Feature` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Feature" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "description" TEXT NOT NULL;
