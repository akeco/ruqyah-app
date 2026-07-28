import Link from "next/link";

interface FooterProps {
  lang: string;
}

export function Footer({ lang }: FooterProps) {
  const isBs = lang === "bs";

  const currentYear = new Date().getFullYear();

  // href values are locale-relative — the lang prefix is added at render time
  const footerLinks = {
    en: {
      product: [
        { label: "About Ruqya", href: "" },
        { label: "Lectures", href: "/lectures" },
        { label: "Audio Library", href: "/audio" },
        { label: "Contact", href: "#contact" },
      ],
      legal: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Disclaimer", href: "/disclaimer" },
      ],
    },
    bs: {
      product: [
        { label: "O Ruqyi", href: "" },
        { label: "Predavanja", href: "/lectures" },
        { label: "Audio biblioteka", href: "/audio" },
        { label: "Kontakt", href: "#contact" },
      ],
      legal: [
        { label: "Politika privatnosti", href: "/privacy" },
        { label: "Uslovi koristenja", href: "/terms" },
        { label: "Odricanje od odgovornosti", href: "/disclaimer" },
      ],
    },
  };

  const links = footerLinks[isBs ? "bs" : "en"];

  return (
    <footer className="bg-olive-900 text-foreground-inverse" role="contentinfo">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <Link href={`/${lang}`} className="inline-flex items-center gap-2.5 mb-4">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                <svg className="h-5 w-5 text-secondary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <span className="text-lg font-heading font-bold text-foreground-inverse">Ruqya</span>
            </Link>
            <p className="text-sm text-foreground-inverse/60 leading-relaxed max-w-xs">
              {isBs
                ? "Duhovno iscjeljenje putem Kur'ana i autentichnih dove. Sluzimo vam sa ljubavlju i posvecenoscu."
                : "Spiritual healing through the Quran and authentic supplications. Serving you with love and dedication."}
            </p>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground-inverse uppercase tracking-wider mb-4">
              {isBs ? "Navigacija" : "Navigation"}
            </h3>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${lang}${link.href}`}
                    className="text-sm text-foreground-inverse/60 hover:text-foreground-inverse transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground-inverse uppercase tracking-wider mb-4">
              {isBs ? "Pravno" : "Legal"}
            </h3>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${lang}${link.href}`}
                    className="text-sm text-foreground-inverse/60 hover:text-foreground-inverse transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer bar */}
      <div className="border-t border-foreground-inverse/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-secondary/10 border border-secondary/20 rounded-lg px-4 py-3 mb-4">
            <p className="text-xs text-secondary/90 leading-relaxed">
              {isBs
                ? "ODRICANJE OD ODGOVORNOSTA: Sadrzaj na ovom sajtu je namijenjen iskljucivo u edukativne i informativne svrhe. Nije namijenjen kao zamjena za profesionalnu medicinsku ili psiholosku pomoc. Za bilo koje zdravstvene probleme obratite se licenciranom zdravstvenom radniku. Spiritualno iscjeljenje treba koristiti kao dopunu, a ne zamjenu za konvencionalno lijecnje."
                : "DISCLAIMER: Content on this site is for educational and informational purposes only. It is not intended as a substitute for professional medical or psychological advice. For any health concerns, consult a licensed healthcare provider. Spiritual healing should be used as a complement to, not a replacement for, conventional medical treatment."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-foreground-inverse/40">
              {isBs
                ? "Lijek je jedino od Allaha. Autorska prava 2026. Sva prava zadržena."
                : "Healing comes only from Allah. Copyright 2026. All rights reserved."}
            </p>
            <div className="flex items-center gap-4">
              {/* Social icons */}
              <a href="https://www.youtube.com/@rukjakurs" className="text-foreground-inverse/40 hover:text-foreground-inverse/80 transition-colors" aria-label="YouTube">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.041 0 12 0 12s0 3.959.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.959 24 12 24 12s0-3.959-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              {/* <a href="#" className="text-emerald-400/40 hover:text-emerald-300 transition-colors" aria-label="Instagram">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </a>
              {/* <a href="#" className="text-emerald-400/40 hover:text-emerald-300 transition-colors" aria-label="Twitter">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
