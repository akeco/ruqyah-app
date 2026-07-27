import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VALID_LANGUAGES } from "@/lib/locale";
import { fontClassNames } from "@/lib/fonts";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface LocalizedLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

// Dynamic metadata for the layout
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isBs = lang === "bs";

  return {
    title: {
      default: isBs ? "Ruqya Liječenje Kur'anom" : "Ruqya Healing - Quran-Based Spiritual Healing",
      template: `%s | Ruqya`,
    },
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: "/en",
        bs: "/bs",
      },
    },
    openGraph: {
      locale: isBs ? "bs_BA" : "en_US",
      type: "website",
    },
  };
}

export function generateStaticParams() {
  return VALID_LANGUAGES.map((lang) => ({ lang }));
}

// Localized layout — injects lang attribute and wraps with Navbar/Footer
export default async function LocalizedLayout({ children, params }: LocalizedLayoutProps) {
  const { lang } = await params;

  if (!VALID_LANGUAGES.includes(lang as "en" | "bs")) {
    notFound();
  }

  const isBs = lang === "bs";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ruqyaliјecenje.com";

  // Organization + WebSite structured data — helps both search engines and
  // AI answer engines (GEO) identify the site and its purpose.
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Ruqya Healing",
      url: siteUrl,
      description: isBs
        ? "Platforma za islamsko duhovno iscjeljenje putem rukje, poslaničke medicine i online audio/video konsultacija."
        : "A platform for Islamic spiritual healing through Ruqya, prophetic medicine, and online audio/video consultations.",
      areaServed: "Worldwide",
      knowsAbout: [
        "Ruqya",
        "Islamic spiritual healing",
        "Evil eye",
        "Black magic",
        "Prophetic medicine",
        "Black seed oil",
        "Hijama cupping",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Ruqya Healing",
      url: siteUrl,
      inLanguage: isBs ? "bs" : "en",
    },
  ];

  return (
    <div lang={lang} className={`${fontClassNames} flex min-h-screen flex-col`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar lang={lang} />
      <div className="flex-1">{children}</div>
      <Footer lang={lang} />
    </div>
  );
}
