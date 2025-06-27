/*
  Warnings:

  - You are about to drop the column `techType` on the `EcoType` table. All the data in the column will be lost.
  - Added the required column `ecoType` to the `EcoType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EcoType" DROP COLUMN "techType",
ADD COLUMN     "ecoType" TEXT NOT NULL;
