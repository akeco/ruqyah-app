import Image from "next/image";
import Link from "next/link";
import { ContactMessagingButtons } from "@/components/home/ContactMessagingButtons";

interface FooterProps {
  lang: string;
}

export function Footer({ lang }: FooterProps) {
  const isBs = lang === "bs";

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    en: {
      product: [
        { label: "About Ruqya", href: "/en" },
        { label: "Lectures", href: "/en/lectures" },
        { label: "Audio Library", href: "/en/audio" },
        { label: "Contact", href: "/en#contact" },
      ],
      legal: [
        { label: "Privacy Policy", href: "/en/privacy" },
        { label: "Terms of Service", href: "/en/terms" },
        { label: "Disclaimer", href: "/en/disclaimer" },
      ],
    },
    bs: {
      product: [
        { label: "O Ruqyi", href: "/bs" },
        { label: "Predavanja", href: "/bs/lectures" },
        { label: "Audio biblioteka", href: "/bs/audio" },
        { label: "Kontakt", href: "/bs#contact" },
      ],
      legal: [
        { label: "Politika privatnosti", href: "/bs/privacy" },
        { label: "Uslovi koristenja", href: "/bs/terms" },
        { label: "Odricanje od odgovornosti", href: "/bs/disclaimer" },
      ],
    },
  };

  const links = footerLinks[isBs ? "bs" : "en"];

  return (
    <footer className="bg-emerald-950 text-white" role="contentinfo">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href={`/${lang}`} className="inline-flex items-center group mb-4" aria-label="Mehlem Clinic Home">
              <Image
                src="/images/mehlem-clinic-icon-footer.webp"
                alt=""
                width={299}
                height={315}
                className="h-9 w-auto sm:hidden"
                aria-hidden
              />
              <Image
                src="/images/mehlem-clinic-logo-inline-footer.webp"
                alt="Mehlem Clinic"
                width={1178}
                height={244}
                className="hidden h-10 w-auto sm:block"
              />
            </Link>
            <p className="text-sm text-emerald-300/60 leading-relaxed max-w-xs">
              {isBs
                ? "Duhovno iscjeljenje putem Kur'ana i autentichnih dove. Sluzimo vam sa ljubavlju i posvecenoscu."
                : "Spiritual healing through the Quran and authentic supplications. Serving you with love and dedication."}
            </p>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {isBs ? "Navigacija" : "Navigation"}
            </h3>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${lang}${link.href}`}
                    className="text-sm text-emerald-300/60 hover:text-emerald-200 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {isBs ? "Pravno" : "Legal"}
            </h3>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${lang}${link.href}`}
                    className="text-sm text-emerald-300/60 hover:text-emerald-200 transition-colors"
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
      <div className="border-t border-emerald-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-amber-950/30 border border-amber-900/30 rounded-lg px-4 py-3 mb-4">
            <p className="text-xs text-amber-200/60 leading-relaxed">
              {isBs
                ? "ODRICANJE OD ODGOVORNOSTA: Sadrzaj na ovom sajtu je namijenjen iskljucivo u edukativne i informativne svrhe. Nije namijenjen kao zamjena za profesionalnu medicinsku ili psiholosku pomoc. Za bilo koje zdravstvene probleme obratite se licenciranom zdravstvenom radniku. Spiritualno iscjeljenje treba koristiti kao dopunu, a ne zamjenu za konvencionalno lijecnje."
                : "DISCLAIMER: Content on this site is for educational and informational purposes only. It is not intended as a substitute for professional medical or psychological advice. For any health concerns, consult a licensed healthcare provider. Spiritual healing should be used as a complement to, not a replacement for, conventional medical treatment."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-emerald-400/40">
              &copy; {currentYear} Ruqya Healing. {isBs ? "Sva prava zadrzana." : "All rights reserved."}
            </p>
            <div className="flex items-center gap-4">
              <ContactMessagingButtons lang={lang} variant="footer" />
              <a href="https://www.youtube.com/@rukjakurs" className="text-emerald-400/40 hover:text-emerald-300 transition-colors" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.041 0 12 0 12s0 3.959.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.959 24 12 24 12s0-3.959-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
