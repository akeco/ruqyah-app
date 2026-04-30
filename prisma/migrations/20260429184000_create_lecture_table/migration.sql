-- CreateLectureTable
CREATE TABLE "Lecture" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleBs" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "descriptionBs" TEXT,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lecture_pkey" PRIMARY KEY ("id")
);
