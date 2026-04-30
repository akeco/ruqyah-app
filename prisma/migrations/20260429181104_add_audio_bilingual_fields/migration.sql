/*
  Warnings:

  - You are about to drop the column `description` on the `Audio` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Audio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Audio" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "descriptionBs" TEXT,
ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "titleBs" TEXT,
ADD COLUMN     "titleEn" TEXT;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
