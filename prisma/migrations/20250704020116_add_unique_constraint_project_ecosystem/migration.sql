/*
  Warnings:

  - A unique constraint covering the columns `[projectId,ecoId]` on the table `ProjectEcosystem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProjectEcosystem_projectId_ecoId_key" ON "ProjectEcosystem"("projectId", "ecoId");
