/*
  Warnings:

  - You are about to drop the column `ecoType` on the `EcoType` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `ProjectType` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `tech` on the `Tech` table. All the data in the column will be lost.
  - You are about to drop the column `techType` on the `TechType` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `ProjectType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Tech` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `EcoType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Tech` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ProjectType_type_key";

-- DropIndex
DROP INDEX "Role_role_key";

-- DropIndex
DROP INDEX "Tech_tech_key";

-- AlterTable
ALTER TABLE "EcoType" DROP COLUMN "ecoType",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProjectType" DROP COLUMN "type",
ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "role",
ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "Tech" DROP COLUMN "tech",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TechType" DROP COLUMN "techType",
ADD COLUMN     "name" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ProjectType_name_key" ON "ProjectType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tech_name_key" ON "Tech"("name");
