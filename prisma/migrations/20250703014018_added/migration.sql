/*
  Warnings:

  - You are about to drop the column `logo` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Project` table. All the data in the column will be lost.
  - Added the required column `logoAlt` to the `Link` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logoGrn` to the `Link` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logoOrg` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Link" DROP COLUMN "logo",
ADD COLUMN     "logoAlt" TEXT NOT NULL,
ADD COLUMN     "logoGrn" TEXT NOT NULL,
ADD COLUMN     "logoOrg" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "image",
ADD COLUMN     "imageAlt" TEXT,
ADD COLUMN     "imageGrn" TEXT,
ADD COLUMN     "imageOrg" TEXT;
