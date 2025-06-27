/*
  Warnings:

  - Made the column `name` on table `ProjectType` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `TechType` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ProjectType" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "TechType" ALTER COLUMN "name" SET NOT NULL;
