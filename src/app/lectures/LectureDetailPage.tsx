import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { extractLectureId } from "./slug";

type Language = "en" | "bos";

interface LectureDetailPageProps {
  language: Language;
  slugId: string;
}

export default async function LectureDetailPage({ language, slugId }: LectureDetailPageProps) {
  const id = extractLectureId(slugId);
  const lecture = await prisma.lecture.findUnique({ where: { id } });

  if (!lecture) notFound();

  const title = language === "bos" ? lecture.titleBs : lecture.titleEn;
  const description = language === "bos" ? lecture.descriptionBs : lecture.descriptionEn;
  const backHref = language === "bos" ? "/bs/lectures" : "/en/lectures";
  const backText = language === "bos" ? "Nazad na predavanja" : "Back to lectures";

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          href={backHref}
          className="text-sm font-medium text-indigo-600 underline-offset-4 hover:underline"
        >
          {backText}
        </Link>

        <article className="mt-4 overflow-hidden rounded-lg bg-white shadow-sm">
          <img src={lecture.imageUrl} alt={title} className="h-64 w-full object-cover sm:h-80" />
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {description && <p className="mt-3 text-sm leading-6 text-gray-700">{description}</p>}
          </div>
        </article>
      </div>
    </main>
  );
}
