import { notFound } from "next/navigation";
import { Metadata } from "next";
import { CustomAudioPlayer } from "@/components/audio/CustomAudioPlayer";
import { getAudioBySlug } from "@/lib/data/audio";

// Always render per-request so edits made in the admin panel show up immediately
export const dynamic = "force-dynamic";

interface AudioDetailProps {
  params: Promise<{ lang: string; slug: string }>;
}

// Dynamic metadata
export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const isBs = lang === "bs";

  let title = isBs ? "Audio" : "Audio";
  let description = isBs
    ? "Ruqya audio zapis za iscjeljenje."
    : "A Ruqya audio recording for healing.";

  try {
    const audio = await getAudioBySlug(slug);
    if (audio) {
      title = isBs ? `${audio.title_bs} | Audio Biblioteka` : `${audio.title_en} | Audio Library`;
      description = isBs
        ? audio.description_bs || audio.title_bs || "Ruqya audio zapis."
        : audio.description_en || audio.title_en || "A Ruqya audio recording.";
    }
  } catch {
    // metadata fallback
  }

  return {
    title,
    description,
    keywords: isBs
      ? "rukja audio, recitacija za zastitu, urok, sihr, dhikr"
      : "ruqya audio, protection recitation, evil eye, black magic, dhikr",
    alternates: {
      canonical: `/${lang}/audio/${slug}`,
      languages: {
        en: `/en/audio/${slug}`,
        bs: `/bs/audio/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: isBs ? "bs_BA" : "en_US",
      url: `https://mehlem-clinic.com/${lang}/audio/${slug}`,
    },
  };
}

export function generateStaticParams() {
  return [];
}

// Server component
export default async function AudioDetailPage({ params }: AudioDetailProps) {
  const { lang, slug } = await params;
  const isBs = lang === "bs";

  // Fetch audio data directly from the database (no self-fetch over HTTP)
  let audio: any = null;
  let fetchError = false;
  try {
    audio = await getAudioBySlug(slug);
  } catch (error) {
    console.error("Failed to load audio:", error);
    fetchError = true;
  }

  if (!audio && !fetchError) {
    notFound();
  }

  if (!audio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-olive-900">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-foreground-inverse/10 flex items-center justify-center mb-6">
            <svg className="h-8 w-8 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-heading font-bold text-foreground-inverse mb-2">
            {isBs ? "Ucitavanje..." : "Loading..."}
          </h2>
          <p className="text-foreground-inverse/60 text-sm">
            {isBs ? "Molim vas, sacekajte." : "Please wait while content loads."}
          </p>
        </div>
      </div>
    );
  }

  const title = isBs ? audio.title_bs : audio.title_en;
  const description = isBs ? audio.description_bs : audio.description_en;
  const audioUrl = audio.url;
  const reciter = isBs ? audio.reciter_bs : audio.reciter_en;
  const duration = audio.duration;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AudioObject",
    name: title,
    description: description || "",
    contentUrl: audioUrl || "",
    duration: `PT${duration || 60}M`,
    encodingFormat: "audio/mpeg",
    actor: {
      "@type": "Person",
      name: reciter || (isBs ? "Tim Mehlem Clinic" : "Mehlem Clinic Team"),
    },
    publisher: {
      "@type": "Organization",
      name: "Mehlem Clinic",
    },
    inLanguage: lang,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isBs ? "Početna" : "Home",
        item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://mehlem-clinic.com"}/${lang}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isBs ? "Audio biblioteka" : "Audio Library",
        item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://mehlem-clinic.com"}/${lang}/audio`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://mehlem-clinic.com"}/${lang}/audio/${slug}`,
      },
    ],
  };

  return (
    <article className="min-h-screen bg-background">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <header className="bg-olive-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground-inverse leading-tight mb-6">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-foreground-inverse/70 text-sm">
            {reciter && (
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {reciter}
              </span>
            )}
            {duration && (
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {duration} min
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Description */}
        {description && (
          <div className="mb-10">
            <h2 className="text-xl font-heading font-bold text-foreground mb-4">
              {isBs ? "Opis" : "Description"}
            </h2>
            <p className="text-foreground leading-relaxed text-lg">
              {description}
            </p>
          </div>
        )}

        {/* Audio Player */}
        {audioUrl && (
          <div className="mb-10">
            <h2 className="text-xl font-heading font-bold text-foreground mb-4">
              {isBs ? "Slusajte" : "Listen"}
            </h2>
            <CustomAudioPlayer
              src={audioUrl}
              title={title}
              description={description}
              lang={lang}
            />
          </div>
        )}

        {/* Divider */}
        <div className="my-12 flex items-center gap-4">
          <div className="flex-1 h-px bg-border-subtle" />
          <svg className="h-5 w-5 text-secondary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <div className="flex-1 h-px bg-border-subtle" />
        </div>

        {/* Back to audio library */}
        <a
          href={`/${lang}/audio`}
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {isBs ? "< Nazad na audio biblioteku" : "< Back to Audio Library"}
        </a>
      </div>
    </article>
  );
}
