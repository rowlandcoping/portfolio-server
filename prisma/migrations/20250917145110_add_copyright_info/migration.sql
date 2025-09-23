/*
  Warnings:

  - Added the required column `copyName` to the `About` table without a default value. This is not possible if the table is not empty.
  - Added the required column `copyYear` to the `About` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."About" ADD COLUMN     "copyName" TEXT NOT NULL,
ADD COLUMN     "copyYear" INTEGER NOT NULL;
