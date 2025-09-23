/*
  Warnings:

  - Made the column `imageAlt` on table `Personal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageGrn` on table `Personal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageOrg` on table `Personal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `favColor` on table `Personal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `starSign` on table `Personal` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Personal" ALTER COLUMN "imageAlt" SET NOT NULL,
ALTER COLUMN "imageGrn" SET NOT NULL,
ALTER COLUMN "imageOrg" SET NOT NULL,
ALTER COLUMN "favColor" SET NOT NULL,
ALTER COLUMN "starSign" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."ProjectEcosystem" ADD COLUMN     "aboutId" INTEGER,
ALTER COLUMN "projectId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."About" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "overview" TEXT NOT NULL,
    "typeId" INTEGER NOT NULL,
    "repo" TEXT NOT NULL,

    CONSTRAINT "About_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "About_userId_key" ON "public"."About"("userId");

-- AddForeignKey
ALTER TABLE "public"."ProjectEcosystem" ADD CONSTRAINT "ProjectEcosystem_aboutId_fkey" FOREIGN KEY ("aboutId") REFERENCES "public"."About"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."About" ADD CONSTRAINT "About_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."About" ADD CONSTRAINT "About_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "public"."ProjectType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
