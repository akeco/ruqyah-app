import { notFound } from "next/navigation";
import { Metadata } from "next";
import { VALID_LANGUAGES } from "@/lib/locale";
import { LectureCard } from "@/components/lectures/LectureCard";

interface LecturesPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string }>;
}

// Dynamic metadata
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const isBs = lang === "bs";

  return {
    title: isBs
      ? "Predavanja o Rukji, Uroku, Sihru i Poslaničkoj Medicini"
      : "Islamic Lectures on Ruqya, Evil Eye, Black Magic & Prophetic Medicine",
    description: isBs
    ? "Besplatna edukativna predavanja o rukji, uroku (al-ajn), sihru, vesvesi i poslaničkoj medicini. Naučite kako prepoznati duhovne smetnje i ispravno se zaštititi kroz Kur'an i Sunnet."
    : "Free educational lectures on Ruqya, the evil eye (al-'ayn), black magic (sihr), waswas, and prophetic medicine. Learn how to recognize spiritual ailments and protect yourself the correct way through the Quran and Sunnah.",
    keywords: isBs
      ? "predavanja o rukji, urok, sihr, vesvesa, aqida, poslanička medicina, islamsko obrazovanje, zaštita od džina, hasad"
      : "ruqya lectures, evil eye lectures, black magic lectures, waswas, aqidah, prophetic medicine lectures, islamic education, jinn protection, envy hasad",
    alternates: {
      canonical: `/${lang}/lectures`,
      languages: {
        en: "/en/lectures",
        bs: "/bs/lectures",
      },
    },
    openGraph: {
      title: isBs ? "Predavanja o Rukji i Duhovnom Iscjeljenju" : "Lectures on Ruqya and Spiritual Healing",
      description: isBs
        ? "Istrazite nasu biblioteku predavanja o rukji, uroku, sihru i poslaničkoj medicini."
        : "Explore our library of lectures on Ruqya, the evil eye, black magic, and prophetic medicine.",
      type: "website",
      locale: isBs ? "bs_BA" : "en_US",
    },
  };
}

export function generateStaticParams() {
  return VALID_LANGUAGES.map((lang) => ({ lang }));
}

// Server component
export default async function LecturesPage({ params, searchParams }: LecturesPageProps) {
  const { lang } = await params;
  const isBs = lang === "bs";
  const { category } = await searchParams;

  // Fetch lectures from API
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  let lectures: any[] = [];
  try {
    const res = await fetch(
      `${apiBase}/api/lectures?lang=${lang}${category ? `&category=${category}` : ""}`,
      {
        next: { revalidate: 60 },
        cache: "force-cache",
      }
    );

    if (res.ok) {
      const data = await res.json();
      lectures = data.lectures || [];
    }
  } catch {
    // API unavailable — show empty state
  }

  // Filter by category if provided
  const filtered = category
    ? lectures.filter((l: any) =>
        isBs ? l.category_bs === category : l.category_en === category
      )
    : lectures;

  // Get unique categories from fetched data
  const categories = Array.from(
    new Set(
      (lectures as { category_en?: string; category_bs?: string }[])
        .map((l) => (isBs ? l.category_bs : l.category_en))
        .filter(Boolean)
    )
  ) as string[];

  const categoryLabels: Record<string, string> = isBs
    ? {
        ruqya: "Ruqya",
        "aqidah": "Aqidah",
        "mental-health": "Mentalno zdravlje",
        "family": "Porodica",
        "general": "Opste",
      }
    : {
        ruqya: "Ruqya",
        aqidah: "Aqidah",
        "mental-health": "Mental Health",
        family: "Family",
        general: "General",
      };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-olive-900 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-secondary/20 border border-secondary/30 px-4 py-1.5 text-xs font-semibold tracking-wide text-foreground-inverse uppercase mb-4">
              {isBs ? "Biblioteka" : "Library"}
            </span>
            <h1 className="text-3xl sm:text-5xl font-heading font-bold text-foreground-inverse mb-4">
              {isBs ? "Predavanja" : "Lectures"}
            </h1>
            <p className="text-foreground-inverse/80 text-lg leading-relaxed">
              {isBs
                ? "Pouke i znanje iz Kur'ana i Sunneta za duhovni rast i iscjeljenje."
                : "Wisdom and knowledge from the Quran and Sunnah for spiritual growth and healing."}
            </p>
          </div>
        </div>
      </section>

      {/* SEO intro content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-6">
        <div className="max-w-3xl">
          <p className="text-foreground-muted leading-relaxed">
            {isBs
              ? "Naša biblioteka predavanja pokriva teme poput uroka (al-ajn), sihra (crne magije), vesvese, hasada (zavisti), opsjednutosti džinima, kao i poslaničke medicine i prirodnih lijekova. Svako predavanje je napisano da vam pomogne da prepoznate znakove duhovnih smetnji i naučite ispravan način zaštite i liječenja kroz Kur'an i Sunnet, uz poštovanje autentičnih izvora akide (islamskog vjerovanja)."
              : "Our lecture library covers topics such as the evil eye (al-'ayn), black magic (sihr), waswas, hasad (envy), jinn possession, and prophetic medicine and natural remedies. Each lecture is written to help you recognize the signs of spiritual ailments and learn the correct way to seek protection and treatment through the Quran and Sunnah, grounded in authentic sources of aqidah (Islamic creed)."}
          </p>
        </div>
      </section>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="flex flex-wrap gap-2">
            <a
              href={`/${lang}/lectures`}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                !category
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-card text-foreground-muted hover:bg-accent hover:text-primary border border-border-subtle"
              }`}
            >
              {isBs ? "Sve" : "All"}
            </a>
            {categories.map((cat) => (
              <a
                key={cat}
                href={`/${lang}/lectures?category=${cat}`}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  category === cat
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-card text-foreground-muted hover:bg-accent hover:text-primary border border-border-subtle"
                }`}
              >
                {categoryLabels[cat] || cat}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Lectures grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <svg className="mx-auto h-16 w-16 text-foreground-muted/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2z" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              {isBs ? "Nema pronađenih predavanja" : "No lectures found"}
            </h3>
            <p className="mt-1 text-sm text-foreground-muted">
              {isBs ? "Pokusajte sa drugom kategorijom." : "Try a different category."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((lecture: any) => (
              <LectureCard key={lecture.id} lecture={lecture} lang={lang} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
