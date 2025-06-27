/*
  Warnings:

  - You are about to drop the column `roleCode` on the `Role` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `Role` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "Role_roleCode_key";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "roleCode",
ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Role_uuid_key" ON "Role"("uuid");
