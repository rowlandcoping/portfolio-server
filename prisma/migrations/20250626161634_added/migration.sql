/*
  Warnings:

  - A unique constraint covering the columns `[singleton]` on the table `Personal` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Personal" ADD COLUMN     "singleton" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Personal_singleton_key" ON "Personal"("singleton");
