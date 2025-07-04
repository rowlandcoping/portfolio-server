/*
  Warnings:

  - You are about to drop the `_ProjectEcosystems` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Skill` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tech" DROP CONSTRAINT "Tech_ecoId_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectEcosystems" DROP CONSTRAINT "_ProjectEcosystems_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectEcosystems" DROP CONSTRAINT "_ProjectEcosystems_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectTech" DROP CONSTRAINT "_ProjectTech_A_fkey";

-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ProjectEcosystems";

-- CreateTable
CREATE TABLE "ProjectEcosystem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ecoId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "ProjectEcosystem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectEcosystem" ADD CONSTRAINT "ProjectEcosystem_ecoId_fkey" FOREIGN KEY ("ecoId") REFERENCES "Ecosystem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectEcosystem" ADD CONSTRAINT "ProjectEcosystem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectTech" ADD CONSTRAINT "_ProjectTech_A_fkey" FOREIGN KEY ("A") REFERENCES "ProjectEcosystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
