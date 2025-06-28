/*
  Warnings:

  - You are about to drop the column `ecoId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `techId` on the `Project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_ecoId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_techId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "ecoId",
DROP COLUMN "techId";

-- CreateTable
CREATE TABLE "_ProjectTech" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProjectTech_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProjectEcosystems" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProjectEcosystems_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProjectTech_B_index" ON "_ProjectTech"("B");

-- CreateIndex
CREATE INDEX "_ProjectEcosystems_B_index" ON "_ProjectEcosystems"("B");

-- AddForeignKey
ALTER TABLE "_ProjectTech" ADD CONSTRAINT "_ProjectTech_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectTech" ADD CONSTRAINT "_ProjectTech_B_fkey" FOREIGN KEY ("B") REFERENCES "Tech"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectEcosystems" ADD CONSTRAINT "_ProjectEcosystems_A_fkey" FOREIGN KEY ("A") REFERENCES "Ecosystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectEcosystems" ADD CONSTRAINT "_ProjectEcosystems_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
