import AudioPlayer from "@/components/admin/AudioPlayer";
import { prisma } from "@/lib/prisma";
import LanguageSwitcher from "./LanguageSwitcher";

type Language = "en" | "bos";

interface AudioLibraryPageProps {
  language: Language;
}

export default async function AudioLibraryPage({ language }: AudioLibraryPageProps) {
  const copy =
    language === "bos"
      ? {
          heading: "Audio Biblioteka",
          subtitle: "Poslušajte sve dostupne audio snimke.",
          empty: "Još nema dostupnih audio snimaka.",
        }
      : {
          heading: "Audio Library",
          subtitle: "Listen to all available audio recordings.",
          empty: "No audio files available yet.",
        };

  const audios = await prisma.audio.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{copy.heading}</h1>
            <p className="mt-1 text-sm text-gray-600">{copy.subtitle}</p>
          </div>
          <LanguageSwitcher currentLanguage={language} />
        </div>

        {audios.length === 0 ? (
          <div className="mt-8 rounded-lg bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
            {copy.empty}
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {audios.map((audio) => {
              const title = language === "bos" ? audio.titleBs : audio.titleEn;
              const description = language === "bos" ? audio.descriptionBs : audio.descriptionEn;

              return (
                <article key={audio.id} className="rounded-lg bg-white p-4 shadow-sm">
                  <h2 className="text-base font-semibold text-gray-900">{title}</h2>
                  {description && (
                    <div className="mt-1 space-y-1 text-sm text-gray-600">
                      <p>{description}</p>
                    </div>
                  )}
                  <div className="mt-3">
                    <AudioPlayer src={audio.url} />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
