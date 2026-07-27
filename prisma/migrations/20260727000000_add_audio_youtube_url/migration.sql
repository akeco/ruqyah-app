-- Add YouTube video link support to Audio table
ALTER TABLE "Audio" ADD COLUMN "youtubeUrl" TEXT;

-- An audio item can now be defined by a YouTube link instead of an uploaded file
ALTER TABLE "Audio" ALTER COLUMN "url" DROP NOT NULL;
