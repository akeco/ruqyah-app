import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import LectureDetailPage from "@/app/lectures/LectureDetailPage";
import { extractLectureId, lectureSlugId } from "@/app/lectures/slug";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slugId: string }>;
}): Promise<Metadata> {
  const { slugId } = await params;
  const id = extractLectureId(slugId);
  const lecture = await prisma.lecture.findUnique({ where: { id } });

  if (!lecture) {
    return { title: "Lecture not found" };
  }

  const enSlug = lectureSlugId(lecture.titleEn, lecture.id);
  const bsSlug = lectureSlugId(lecture.titleBs, lecture.id);

  return {
    title: lecture.titleEn,
    description: lecture.descriptionEn || "Lecture details",
    alternates: {
      canonical: `/en/lectures/${enSlug}`,
      languages: {
        en: `/en/lectures/${enSlug}`,
        bs: `/bs/lectures/${bsSlug}`,
      },
    },
  };
}

export default async function EnglishLectureDetailsPage({
  params,
}: {
  params: Promise<{ slugId: string }>;
}) {
  const { slugId } = await params;
  return <LectureDetailPage language="en" slugId={slugId} />;
}
