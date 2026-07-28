import { notFound } from "next/navigation";
import { Metadata } from "next";
import { VALID_LANGUAGES } from "@/lib/locale";
import { ContactCtaBanner } from "@/components/ContactCtaBanner";

interface LectureDetailProps {
  params: Promise<{ lang: string; slug: string }>;
}

// Dynamic metadata — reads from fetched data
export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const isBs = lang === "bs";

  // Try to fetch the lecture for metadata
  let title = isBs ? "Predavanje" : "Lecture";
  let description = isBs
    ? "Predavanje o Ruqyi i iscjeljivanju Kur'anom."
    : "A lecture on Ruqya and Quran-based healing.";

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/lectures/${slug}?lang=${lang}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const data = await res.json();
      const lecture = data.lecture;
      if (lecture) {
        title = isBs ? `${lecture.title_bs} | Ruqya Predavanja` : `${lecture.title_en} | Ruqya Lectures`;
        description = isBs
          ? lecture.excerpt_bs || lecture.content_bs?.slice(0, 160) || "Predavanje o Ruqyi."
          : lecture.excerpt_en || lecture.content_en?.slice(0, 160) || "A lecture on Ruqya.";
      }
    }
  } catch {
    // metadata fallback
  }

  return {
    title,
    description,
    keywords: isBs
      ? "rukja, urok, sihr, poslanička medicina, islamsko predavanje"
      : "ruqya, evil eye, black magic, prophetic medicine, islamic lecture",
    alternates: {
      canonical: `/${lang}/lectures/${slug}`,
      languages: {
        en: `/en/lectures/${slug}`,
        bs: `/bs/lectures/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      type: "article",
      locale: isBs ? "bs_BA" : "en_US",
      url: `https://ruqyaliјecenje.com/${lang}/lectures/${slug}`,
    },
  };
}

export function generateStaticParams() {
  // Return empty array to make pages dynamic - content is fetched from API at request time
  return [];
}

// Server component
export default async function LectureDetailPage({ params }: LectureDetailProps) {
  const { lang, slug } = await params;
  const isBs = lang === "bs";

  // Fetch lecture data
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  let lecture: any = null;
  let fetchError = false;
  try {
    const res = await fetch(
      `${apiBase}/api/lectures/${slug}?lang=${lang}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      if (res.status === 404) {
        notFound();
      }
      throw new Error("Failed to fetch lecture");
    }

    const data = await res.json();
    lecture = data.lecture;
  } catch {
    fetchError = true;
  }

  if (!lecture && !fetchError) {
    notFound();
  }

  // Fallback when API is unavailable
  if (!lecture) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-olive-900">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-foreground-inverse/10 flex items-center justify-center mb-6">
            <svg className="h-8 w-8 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 9v4m-4 0h8m-4-6a4 4 0 11-8 0 4 4 0 018 0z" />
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

  // Use localized fields
  const title = isBs ? lecture.title_bs : lecture.title_en;
  const content = isBs ? lecture.content_bs : lecture.content_en;
  const excerpt = isBs ? lecture.excerpt_bs : lecture.excerpt_en;
  const author = isBs ? lecture.author_bs : lecture.author_en;
  const category = isBs ? lecture.category_bs : lecture.category_en;

  // Format date
  const date = lecture.published_at
    ? new Date(lecture.published_at).toLocaleDateString(isBs ? "bs-BA" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  // Parse content (supports markdown-like formatting)
  const renderContent = (text: string) => {
    return text.split("\n").map((paragraph, i) => {
      if (paragraph.startsWith("## ")) {
        return (
          <h2 key={i} className="text-2xl font-heading font-bold text-foreground mt-10 mb-4">
            {paragraph.replace("## ", "")}
          </h2>
        );
      }
      if (paragraph.startsWith("### ")) {
        return (
          <h3 key={i} className="text-xl font-heading font-bold text-primary mt-8 mb-3">
            {paragraph.replace("### ", "")}
          </h3>
        );
      }
      if (paragraph.startsWith("- ")) {
        return (
          <li key={i} className="flex items-start gap-2 text-foreground ml-4">
            <span className="text-secondary mt-1.5 flex-shrink-0">•</span>
            <span>{paragraph.replace("- ", "")}</span>
          </li>
        );
      }
    
      return (
        <p key={i} className="text-foreground leading-relaxed">
          {paragraph}
        </p>
      );
    });
  };

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt || "",
    author: {
      "@type": "Person",
      name: author || (isBs ? "Tim Ruqya" : "Ruqya Team"),
    },
    publisher: {
      "@type": "Organization",
      name: isBs ? "Ruqya Liječenje Kur'anom" : "Ruqya Healing",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ruqyaliјecenje.com"}/logo.png`,
      },
    },
    datePublished: lecture.published_at || new Date().toISOString(),
    dateModified: lecture.updated_at || new Date().toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://ruqyaliјecenje.com/${lang}/lectures/${slug}`,
    },
    articleSection: category || (isBs ? "Ruqya" : "Ruqya"),
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
        item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ruqyaliјecenje.com"}/${lang}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isBs ? "Predavanja" : "Lectures",
        item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ruqyaliјecenje.com"}/${lang}/lectures`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ruqyaliјecenje.com"}/${lang}/lectures/${slug}`,
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
      <header className="relative overflow-hidden bg-olive-900">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${lecture.image_url || "/images/lecture-placeholder.webp"})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-olive-900/85" aria-hidden />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          {category && (
            <span className="inline-block rounded-full bg-secondary/20 border border-secondary/30 px-4 py-1.5 text-xs font-semibold tracking-wide text-foreground-inverse uppercase mb-4">
              {category}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground-inverse leading-tight mb-6">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-foreground-inverse/70 text-sm">
            {author && (
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {author}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {date}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {lecture.duration_minutes ? `${lecture.duration_minutes} min` : "5 min"}
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Excerpt blockquote */}
        {excerpt && (
          <blockquote className="border-l-4 border-secondary bg-accent/40 rounded-r-xl px-6 py-5 mb-10">
            <p className="text-foreground italic text-lg leading-relaxed">
              {excerpt}
            </p>
          </blockquote>
        )}

        {/* Full content */}
        <div className="prose prose-lg max-w-none">
          {content ? renderContent(content) : <p className="text-foreground-muted">No content available.</p>}
        </div>

        {/* CTA */}
        <ContactCtaBanner lang={lang} variant="card" className="my-12" />

        {/* Back to lectures */}
        <a
          href={`/${lang}/lectures`}
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {isBs ? "Nazad na predavanja" : "Back to Lectures"}
        </a>
      </div>
    </article>
  );
}
