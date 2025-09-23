/*
  Warnings:

  - A unique constraint covering the columns `[aboutId,ecoId]` on the table `ProjectEcosystem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProjectEcosystem_aboutId_ecoId_key" ON "public"."ProjectEcosystem"("aboutId", "ecoId");
