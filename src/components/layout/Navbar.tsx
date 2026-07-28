"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

interface NavbarProps {
  lang: string;
}

const navLinks = [
  { key: "home", en: "Home", bs: "Početna", href: "" },
  { key: "lectures", en: "Lectures", bs: "Predavanja", href: "/lectures" },
  { key: "audio", en: "Audio Library", bs: "Audio Biblioteka", href: "/audio" },
  { key: "contact", en: "Contact", bs: "Kontakt", href: "#contact" },
];

export function Navbar({ lang }: NavbarProps) {
  const pathname = usePathname();
  const isBs = lang === "bs";
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentLang = lang;

  // Strip lang prefix for active check
  const isHomePage = pathname === `/${lang}` || pathname === `/${lang}/`;
  const isActive = (key: string) => {
    if (key === "home") return isHomePage;
    if (key === "contact") return false;
    return pathname.includes(`/${lang}/${key}`);
  };

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-border-subtle bg-background/80 backdrop-blur-md transition-colors"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center group" aria-label="Mehlem Clinic Home">
            <Image
              src="/images/mehlem-clinic-icon.webp"
              alt=""
              width={299}
              height={315}
              className="h-9 w-auto sm:hidden"
              aria-hidden
            />
            <Image
              src="/images/mehlem-clinic-logo-inline.webp"
              alt="Mehlem Clinic"
              width={1178}
              height={244}
              className="hidden h-10 w-auto sm:block"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={`/${lang}${link.href}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.key)
                    ? "text-primary bg-accent"
                    : "text-foreground-muted hover:text-primary hover:bg-background-elevated"
                }`}
              >
                {isBs ? link.bs : link.en}
              </Link>
            ))}
          </div>

          {/* Right side: lang toggle + mobile hamburger */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLang={currentLang} />

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden rounded-lg p-2 text-foreground-muted hover:bg-background-elevated transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen ? (
                  <>
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </>
                ) : (
                  <>
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="mt-2 space-y-1 border-t border-border-subtle pb-4 pt-4 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={`/${lang}${link.href}`}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive(link.key)
                    ? "text-primary bg-accent"
                    : "text-foreground-muted hover:text-primary hover:bg-background-elevated"
                }`}
              >
                {isBs ? link.bs : link.en}
              </Link>
            ))}
            <div className="px-4 pt-2">
              <LanguageSwitcher currentLang={currentLang} onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
