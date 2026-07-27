import { Metadata } from "next";
import { VALID_LANGUAGES } from "@/lib/locale";
import { AudioList } from "@/components/audio/AudioList";

interface AudioPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ type?: string }>;
}

// Dynamic metadata
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isBs = lang === "bs";

  return {
    title: isBs
      ? "Audio Rukja Recitacije i Predavanja za Zaštitu od Uroka i Sihra"
      : "Audio Ruqya Recitations & Lectures for Evil Eye and Black Magic Protection",
    description: isBs
      ? "Slušajte autentične rukja recitacije za zaštitu od uroka, sihra i džina, te edukativna audio predavanja provjerenih alima. Idealno za svakodnevnu zaštitu doma i porodice."
      : "Listen to authentic Ruqya recitations for protection from the evil eye, black magic, and jinn, plus educational audio lectures from reliable scholars. Ideal for daily home and family protection.",
    keywords: isBs
      ? "audio rukja, recitacija za zastitu, urok, sihr, zastita doma, kur'anska recitacija, audio predavanja, dhikr audio"
      : "ruqya audio, protection recitation, evil eye, black magic, home protection, quran recitation, audio lectures, dhikr audio",
    alternates: {
      canonical: `/${lang}/audio`,
      languages: {
        en: "/en/audio",
        bs: "/bs/audio",
      },
    },
    openGraph: {
      title: isBs ? "Audio Rukja Recitacije i Predavanja" : "Audio Ruqya Recitations & Lectures",
      description: isBs
        ? "Slusajte rukja recitacije i predavanja za zastitu i iscjeljenje."
        : "Listen to Ruqya recitations and lectures for protection and healing.",
      type: "website",
      locale: isBs ? "bs_BA" : "en_US",
    },
  };
}

export function generateStaticParams() {
  return VALID_LANGUAGES.map((lang) => ({ lang }));
}

// Server component
export default async function AudioPage({ params, searchParams }: AudioPageProps) {
  const { lang } = await params;
  const isBs = lang === "bs";
  const { type } = await searchParams;

  // Fetch all audio items
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  let audioItems: any[] = [];
  try {
    const res = await fetch(
      `${apiBase}/api/audio?lang=${lang}${type ? `&type=${type}` : ""}`,
      { next: { revalidate: 300 }, cache: "force-cache" }
    );

    if (res.ok) {
      const data = await res.json();
      audioItems = data.audio || [];
    }
  } catch {
    // API unavailable — show empty state
  }

  // Categorize — treat null/missing type as "ruqya" (default for this platform)
  const lectures = audioItems.filter(
    (a: any) => a.type === "lecture" || a.type === "educational"
  );
  const recitations = audioItems.filter(
    (a: any) =>
      a.type === "ruqya" ||
      a.type === "recitation" ||
      a.type === null ||
      a.type === undefined ||
      a.type === ""
  );

  // Filter by type param
  const filteredLectures = type === "recitations" ? [] : lectures;
  const filteredRecitations = type === "lectures" ? [] : recitations;

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-background-hero py-16 sm:py-24 relative overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-secondary/20 border border-secondary/30 px-4 py-1.5 text-xs font-semibold tracking-wide text-foreground-inverse uppercase mb-4">
              {isBs ? "Audio biblioteka" : "Audio Library"}
            </span>
            <h1 className="text-3xl sm:text-5xl font-heading font-bold text-foreground-inverse mb-4">
              {isBs ? "Audio Liječenje" : "Audio Healing"}
            </h1>
            <p className="text-foreground-inverse/80 text-lg leading-relaxed">
              {isBs
                ? "Slusajte Ruqya snimke, predavanja i kur'anske recitacije za duhovno i emocionalno iscjeljenje."
                : "Listen to Ruqya recordings, lectures, and Quranic recitations for spiritual and emotional healing."}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* SEO intro content */}
        <p className="text-foreground-muted leading-relaxed max-w-3xl mb-16">
          {isBs
            ? "Naša audio biblioteka podijeljena je u dvije kategorije: edukativna predavanja koja objašnjavaju uzroke i liječenje duhovnih smetnji, i direktne rukja recitacije namijenjene svakodnevnom slušanju radi zaštite od uroka, sihra i džina. Mnogi korisnici puštaju recitacije kod kuće tokom dana kao oblik trajne duhovne zaštite za sebe i svoju porodicu."
            : "Our audio library is organized into two categories: educational lectures that explain the causes and treatment of spiritual ailments, and direct Ruqya recitations meant for daily listening as protection from the evil eye, black magic, and jinn. Many people play these recitations at home throughout the day as a form of ongoing spiritual protection for themselves and their family."}
        </p>

        {/* Section: Educational Lectures */}
        <section className="mb-16" aria-labelledby="lectures-heading">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1 rounded-full bg-secondary" />
            <div>
              <h2
                id="lectures-heading"
                className="text-2xl sm:text-3xl font-heading font-bold text-foreground"
              >
                {isBs ? "Edukativna Predavanja" : "Educational Lectures"}
              </h2>
              <p className="text-sm text-foreground-muted mt-1">
                {isBs
                  ? `Ovo je ${filteredLectures.length} ${filteredLectures.length === 1 ? "predavanje" : "predavanja"} za učenje o Ruqyi.`
                  : `This is ${filteredLectures.length} ${filteredLectures.length === 1 ? "lecture" : "lectures"} on the topic of Ruqya.`}
              </p>
            </div>
          </div>

          {filteredLectures.length === 0 ? (
            <EmptyState isBs={isBs} type="lectures" />
          ) : (
            <AudioList items={filteredLectures} lang={lang} category="lectures" />
          )}
        </section>

        {/* Section: Direct Ruqya Recitations */}
        <section aria-labelledby="recitations-heading">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1 rounded-full bg-primary" />
            <div>
              <h2
                id="recitations-heading"
                className="text-2xl sm:text-3xl font-heading font-bold text-foreground"
              >
                {isBs ? "Direktne Ruqya Recitacije" : "Direct Ruqya Recitations"}
              </h2>
              <p className="text-sm text-foreground-muted mt-1">
                {isBs
                  ? `Ovo je ${filteredRecitations.length} ${filteredRecitations.length === 1 ? "snimak" : "snimaka"} namijenjen za iscjeljenje.`
                  : `This is ${filteredRecitations.length} ${filteredRecitations.length === 1 ? "recording" : "recordings"} intended for healing.`}
              </p>
            </div>
          </div>
          <p className="text-foreground-muted text-sm mb-8 max-w-2xl">
            {isBs
              ? "Ovi snimci sadrze direktnu Ruqya recitaciju namijenjenu iscjeljenju. Preporucuje se slusanje u mirnom okruzenju sa fokusom na recitaciju."
              : "These recordings contain direct Ruqya recitation intended for healing. Listening in a quiet environment with focus on the recitation is recommended."}
          </p>

          {filteredRecitations.length === 0 ? (
            <EmptyState isBs={isBs} type="recitations" />
          ) : (
            <AudioList items={filteredRecitations} lang={lang} category="recitations" />
          )}
        </section>
      </div>
    </main>
  );
}

// Empty state component
function EmptyState({ isBs, type }: { isBs: boolean; type: "lectures" | "recitations" }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-border bg-background-elevated/50 p-12 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
        {type === "lectures" ? (
          <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ) : (
          <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {type === "lectures"
          ? isBs
            ? "Nema edukativnih predavanja"
            : "No educational lectures"
          : isBs
          ? "Nema Ruqya snimaka"
          : "No Ruqya recordings"}
      </h3>
      <p className="text-sm text-foreground-muted">
        {type === "lectures"
          ? isBs
            ? "Edukativna predavanja ce biti dodana uskoro."
            : "Educational lectures will be added soon."
          : isBs
          ? "Ruqya snimci ce biti dodani uskoro."
          : "Ruqya recordings will be added soon."}
      </p>
    </div>
  );
}
