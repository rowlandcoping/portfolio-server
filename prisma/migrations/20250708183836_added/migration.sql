-- DropForeignKey
ALTER TABLE "ProjectEcosystem" DROP CONSTRAINT "ProjectEcosystem_projectId_fkey";

-- AddForeignKey
ALTER TABLE "ProjectEcosystem" ADD CONSTRAINT "ProjectEcosystem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
