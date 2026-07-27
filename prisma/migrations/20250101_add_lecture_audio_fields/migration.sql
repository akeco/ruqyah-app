-- Add new fields to Lecture table
ALTER TABLE "Lecture" ADD COLUMN "slug" TEXT;
ALTER TABLE "Lecture" ADD COLUMN "contentEn" TEXT;
ALTER TABLE "Lecture" ADD COLUMN "contentBs" TEXT;
ALTER TABLE "Lecture" ADD COLUMN "excerptEn" TEXT;
ALTER TABLE "Lecture" ADD COLUMN "excerptBs" TEXT;
ALTER TABLE "Lecture" ADD COLUMN "authorEn" TEXT;
ALTER TABLE "Lecture" ADD COLUMN "authorBs" TEXT;
ALTER TABLE "Lecture" ADD COLUMN "categoryEn" TEXT;
ALTER TABLE "Lecture" ADD COLUMN "categoryBs" TEXT;
ALTER TABLE "Lecture" ADD COLUMN "publishedAt" TIMESTAMP WITH TIME ZONE;

-- Migrate existing description to content (keep old columns for now)
UPDATE "Lecture" SET "slug" = 'lecture-' || id WHERE "slug" IS NULL;
UPDATE "Lecture" SET "contentEn" = "descriptionEn" WHERE "descriptionEn" IS NOT NULL;
UPDATE "Lecture" SET "contentBs" = "descriptionBs" WHERE "descriptionBs" IS NOT NULL;
UPDATE "Lecture" SET "excerptEn" = "descriptionEn" WHERE "descriptionEn" IS NOT NULL;
UPDATE "Lecture" SET "excerptBs" = "descriptionBs" WHERE "descriptionBs" IS NOT NULL;
UPDATE "Lecture" SET "publishedAt" = "createdAt" WHERE "publishedAt" IS NULL;

-- Add unique constraint on slug
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_slug_key" UNIQUE ("slug");

-- Add new fields to Audio table
ALTER TABLE "Audio" ADD COLUMN "slug" TEXT;
ALTER TABLE "Audio" ADD COLUMN "type" TEXT;
ALTER TABLE "Audio" ADD COLUMN "duration" INTEGER;

-- Set default slug for existing audio
UPDATE "Audio" SET "slug" = 'audio-' || id WHERE "slug" IS NULL;

-- Add unique constraint on slug
ALTER TABLE "Audio" ADD CONSTRAINT "Audio_slug_key" UNIQUE ("slug");
