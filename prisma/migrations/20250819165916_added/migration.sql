-- CreateTable
CREATE TABLE "public"."_SkillTech" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SkillTech_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SkillTech_B_index" ON "public"."_SkillTech"("B");

-- AddForeignKey
ALTER TABLE "public"."_SkillTech" ADD CONSTRAINT "_SkillTech_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SkillTech" ADD CONSTRAINT "_SkillTech_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Tech"("id") ON DELETE CASCADE ON UPDATE CASCADE;
