/*
  Warnings:

  - You are about to drop the column `repo` on the `About` table. All the data in the column will be lost.
  - You are about to drop the column `favColor` on the `Personal` table. All the data in the column will be lost.
  - You are about to drop the column `starSign` on the `Personal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."About" DROP COLUMN "repo",
ADD COLUMN     "clientRepo" TEXT,
ADD COLUMN     "serverRepo" TEXT;

-- AlterTable
ALTER TABLE "public"."Link" ADD COLUMN     "logoGry" TEXT;

-- AlterTable
ALTER TABLE "public"."Personal" DROP COLUMN "favColor",
DROP COLUMN "starSign",
ADD COLUMN     "attributes" TEXT,
ADD COLUMN     "imageGry" TEXT,
ADD COLUMN     "jobTitle" TEXT;

-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "imageGry" TEXT;
