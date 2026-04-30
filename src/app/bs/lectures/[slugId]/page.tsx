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
    return { title: "Predavanje nije pronađeno" };
  }

  const enSlug = lectureSlugId(lecture.titleEn, lecture.id);
  const bsSlug = lectureSlugId(lecture.titleBs, lecture.id);

  return {
    title: lecture.titleBs,
    description: lecture.descriptionBs || "Detalji predavanja",
    alternates: {
      canonical: `/bs/lectures/${bsSlug}`,
      languages: {
        en: `/en/lectures/${enSlug}`,
        bs: `/bs/lectures/${bsSlug}`,
      },
    },
  };
}

export default async function BosnianLectureDetailsPage({
  params,
}: {
  params: Promise<{ slugId: string }>;
}) {
  const { slugId } = await params;
  return <LectureDetailPage language="bos" slugId={slugId} />;
}
