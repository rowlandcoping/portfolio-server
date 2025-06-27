-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_ecoId_fkey";

-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_personId_fkey";

-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_techId_fkey";

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_ecoId_fkey" FOREIGN KEY ("ecoId") REFERENCES "Ecosystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_techId_fkey" FOREIGN KEY ("techId") REFERENCES "Tech"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Personal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
