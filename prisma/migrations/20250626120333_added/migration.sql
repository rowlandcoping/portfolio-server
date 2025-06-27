/*
  Warnings:

  - A unique constraint covering the columns `[roleCode]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roleCode` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "roleCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Role_roleCode_key" ON "Role"("roleCode");
