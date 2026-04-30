import { prisma } from "@/lib/prisma";
import LanguageSwitcher from "./LanguageSwitcher";
import Link from "next/link";
import { lectureSlugId } from "./slug";

type Language = "en" | "bos";

interface LecturesLibraryPageProps {
  language: Language;
}

export default async function LecturesLibraryPage({ language }: LecturesLibraryPageProps) {
  const copy =
    language === "bos"
      ? {
          heading: "Predavanja",
          subtitle: "Pregledajte sva dostupna predavanja.",
          empty: "Još nema dostupnih predavanja.",
        }
      : {
          heading: "Lectures",
          subtitle: "Browse all available lectures.",
          empty: "No lectures available yet.",
        };

  const lectures = await prisma.lecture.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{copy.heading}</h1>
            <p className="mt-1 text-sm text-gray-600">{copy.subtitle}</p>
          </div>
          <LanguageSwitcher currentLanguage={language} />
        </div>

        {lectures.length === 0 ? (
          <div className="mt-8 rounded-lg bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
            {copy.empty}
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lectures.map((lecture) => {
              const title = language === "bos" ? lecture.titleBs : lecture.titleEn;
              const description =
                language === "bos" ? lecture.descriptionBs : lecture.descriptionEn;
              const href =
                language === "bos"
                  ? `/bs/lectures/${lectureSlugId(lecture.titleBs, lecture.id)}`
                  : `/en/lectures/${lectureSlugId(lecture.titleEn, lecture.id)}`;

              return (
                <article
                  key={lecture.id}
                  className="overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <Link href={href} className="block">
                    <img src={lecture.imageUrl} alt={title} className="h-48 w-full object-cover" />
                    <div className="p-4">
                      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
                      {description && <p className="mt-0.5 text-sm text-gray-600">{description}</p>}
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
