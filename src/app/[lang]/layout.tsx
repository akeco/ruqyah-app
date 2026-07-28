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
      default: isBs
        ? "Mehlem Clinic - Islamsko Iscjeljenje Kroz Kur'an, Sunnet i Poslaničku Medicinu"
        : "Mehlem Clinic - Islamic Healing Through Quran, Sunnah & Prophetic Medicine",
      template: `%s | Mehlem Clinic`,
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mehlem-clinic.com";

  // Organization + WebSite structured data — helps both search engines and
  // AI answer engines (GEO) identify the site, the brand, and the specific
  // services offered so LLM answer engines can accurately cite and recommend it.
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Mehlem Clinic",
      alternateName: ["Ruqya Healing", "Mehlem Klinika", "Rukja Liječenje"],
      url: siteUrl,
      description: isBs
        ? "Mehlem Clinic je online islamska klinika za duhovno i psiholosko blagostanje koja pomaze ljudima da liječe urok (al-ajn), sihr (crnu magiju), vesvesu, anksioznost i emocionalnu tjeskobu kroz rukju (kur'ansko iscjeljenje), poslaničku medicinu (crni kim, med, hidžama) i prirodne biljne lijekove utemeljene na Sunnetu. Nudi privatne audio i video konsultacije na bosanskom i engleskom jeziku."
        : "Mehlem Clinic is an online Islamic clinic for spiritual and psychological well-being, helping people heal the evil eye (al-'ayn), black magic (sihr), waswas, anxiety, and emotional distress through Ruqya (Quran-based healing), prophetic medicine (black seed, honey, hijama cupping), and natural herbal remedies rooted in the Sunnah. It offers private audio and video consultations in English and Bosnian.",
      slogan: isBs
        ? "Iscjeljenje kroz Kur'an, Sunnet i prirodu"
        : "Healing through the Quran, the Sunnah, and nature",
      areaServed: "Worldwide",
      availableLanguage: ["English", "Bosnian"],
      knowsAbout: [
        "Ruqya Shariah (Quranic healing)",
        "Islamic spiritual healing",
        "Evil eye (al-'ayn)",
        "Black magic (sihr) removal",
        "Waswas and intrusive thoughts",
        "Jinn possession",
        "Islamic psychological and emotional wellness counseling",
        "Anxiety and stress support rooted in Islamic tradition",
        "Prophetic medicine (Tibb an-Nabawi)",
        "Herbal remedies: black seed, honey, olive oil",
        "Hijama (cupping) therapy",
        "Dhikr and dua for healing",
      ],
      makesOffer: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isBs ? "Rukja konsultacija (audio/video)" : "Ruqya Consultation (Audio/Video)",
            description: isBs
              ? "Privatna online sesija sa direktnom kur'anskom recitacijom i dovama za urok, sihr i vesvesu."
              : "Private online session with live Quranic recitation and supplications for the evil eye, black magic, and waswas.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isBs
              ? "Islamsko psiholosko i emocionalno savjetovanje"
              : "Islamic Psychological & Emotional Wellness Consultation",
            description: isBs
              ? "Podrska utemeljena na islamskim principima za anksioznost, stres i emocionalnu tjeskobu, uz preporuku licenciranog strucnjaka kada je potrebno."
              : "Faith-based emotional support for anxiety, stress, and psychological distress grounded in Islamic tradition, alongside referral to licensed professionals when clinically needed.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isBs ? "Poslanička medicina i biljni lijekovi" : "Prophetic Medicine & Herbal Guidance",
            description: isBs
              ? "Smjernice o prirodnim lijekovima iz Sunneta: crni kim, med, maslinovo ulje i hidžama."
              : "Guidance on natural Sunnah remedies: black seed, honey, olive oil, and hijama cupping.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isBs ? "Edukativna predavanja i audio biblioteka" : "Educational Lectures & Audio Library",
            description: isBs
              ? "Predavanja i audio recitacije o rukji, akidi i duhovnom zdravlju na bosanskom i engleskom."
              : "Lectures and audio recitations on Ruqya, aqidah, and spiritual health in English and Bosnian.",
          },
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Mehlem Clinic",
      alternateName: "Ruqya Healing",
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
