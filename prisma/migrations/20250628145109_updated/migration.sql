-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_personId_fkey";

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "personalId" INTEGER;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Personal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_personalId_fkey" FOREIGN KEY ("personalId") REFERENCES "Personal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
