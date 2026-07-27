import Link from "next/link";

interface FooterProps {
  lang: string;
}

export function Footer({ lang }: FooterProps) {
  const isBs = lang === "bs";

  const t = (en: string, bs: string) => (isBs ? bs : en);

  const disclaimers = {
    en: [
      "Disclaimer: This content is for educational and informational purposes only.",
      "Ruqya is a complementary spiritual practice and should not replace professional medical or psychological treatment.",
      "Always consult qualified healthcare providers for medical conditions.",
    ],
    bs: [
      "Odricanje: Ovaj sadrzaj je iskljucivo edukativnog i informativnog karaktera.",
      "Ruqya je komplementarna spiritualna praksa i ne zamjenjuje profesionalni medicinski ili psiholoski tretman.",
      "Za medicinske stanja uvijek se konsultujte sa kvalifikovanim zdravstvenim radnicima.",
    ],
  };

  const footerLinks = [
    { en: "Home", bs: "Pocetna", href: `/${lang}` },
    { en: "Lectures", bs: "Predavanja", href: `/${lang}/lectures` },
    { en: "Audio", bs: "Audio", href: `/${lang}/audio` },
    { en: "Contact", bs: "Kontakt", href: `/${lang}#contact` },
  ];

  return (
    <footer className="border-t border-emerald-100 bg-white">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-700 to-emerald-900">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-amber-400">
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-lg font-heading font-bold text-emerald-900">{isBs ? "Ruqya" : "Ruqya"}</span>
            </div>
            <p className="text-sm text-stone-500 leading-relaxed">
              {isBs
                ? "Platforma za islamsko spiritualno lijecenje na osnovu Kur'ana i Sunneta."
                : "A platform for Islamic spiritual healing based on the Quran and Sunnah."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-emerald-900 uppercase tracking-wider mb-3">
              {t("Quick Links", "Brze Poveznice")}
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.en}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-500 hover:text-emerald-700 transition-colors"
                  >
                    {t(link.en, link.bs)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-emerald-900 uppercase tracking-wider mb-3">
              {t("Resources", "Resursi")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/en/lectures" className="text-sm text-stone-500 hover:text-emerald-700 transition-colors">
                  {isBs ? "Kur'anski izvori" : "Quranic Sources"}
                </Link>
              </li>
              <li>
                <Link href="/en/audio" className="text-sm text-stone-500 hover:text-emerald-700 transition-colors">
                  {isBs ? "Audio zapisi" : "Audio Recordings"}
                </Link>
              </li>
              <li>
                <Link href="/en/lectures" className="text-sm text-stone-500 hover:text-emerald-700 transition-colors">
                  {isBs ? "Hadisi" : "Hadith Collections"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-emerald-900 uppercase tracking-wider mb-3">
              {t("Contact", "Kontakt")}
            </h3>
            <ul className="space-y-2 text-sm text-stone-500">
              <li>{isBs ? "Email: info@ruqya.com" : "Email: info@ruqya.com"}</li>
              <li>{isBs ? "Odricanje od odgovornosti" : "Medical Disclaimer"}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer bar */}
      <div className="border-t border-stone-200 bg-stone-50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="space-y-1">
            {disclaimers[isBs ? "bs" : "en"].map((line, i) => (
              <p key={i} className="text-xs text-stone-400 leading-relaxed">
                {line}
              </p>
            ))}
          </div>
          <p className="mt-3 text-xs text-stone-400">
            &copy; {new Date().getFullYear()} Ruqya. {isBs ? "Sva prava zadrzana." : "All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}
