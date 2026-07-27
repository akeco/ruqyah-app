"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavbarProps {
  lang: string;
}

const navItems = [
  { key: "home", en: "Home", bs: "Pocetna" },
  { key: "lectures", en: "Lectures", bs: "Predavanja" },
  { key: "audio", en: "Audio", bs: "Audio" },
  { key: "contact", en: "Contact", bs: "Kontakt" },
];

export function Navbar({ lang }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isBs = lang === "bs";

  const t = (en: string, bs: string) => (isBs ? bs : en);

  const isActive = (key: string) => {
    if (key === "home") return pathname === `/${lang}`;
    return pathname === `/${lang}/${key}`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/80 backdrop-blur-md shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-700 to-emerald-900">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-amber-400">
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <span className="text-lg font-heading font-bold text-emerald-900">
              {isBs ? "Ruqya" : "Ruqya"}
            </span>
            <span className="ml-1 text-xs font-medium text-amber-600">
              {isBs ? "\u00B7 Lije\u0107enje" : "\u00B7 Healing"}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={`/${lang}${item.key === "home" ? "" : `/${item.key}`}`}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive(item.key)
                  ? "bg-emerald-50 text-emerald-800"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              {t(item.en, item.bs)}
            </Link>
          ))}
        </div>

        {/* Right side: Language toggle + mobile hamburger */}
        <div className="flex items-center gap-3">
          <LanguageToggle currentLang={lang} />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden rounded-lg p-2 text-stone-600 hover:bg-stone-100"
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-emerald-100 bg-white px-4 py-3 shadow-lg animate-slide-down">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={`/${lang}${item.key === "home" ? "" : `/${item.key}`}`}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.key)
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                {t(item.en, item.bs)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function LanguageToggle({ currentLang }: { currentLang: string }) {
  const other = currentLang === "en" ? "bs" : "en";
  const label = currentLang === "en" ? "BS" : "EN";

  // We need to know the current path to swap correctly
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean); // e.g. ["en", "lectures"]
  const rest = segments.slice(1).join("/");
  const targetHref = `/${other}${rest ? `/${rest}` : ""}`;

  return (
    <Link
      href={targetHref}
      className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 hover:border-emerald-300 transition-colors"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      {label}
    </Link>
  );
}
