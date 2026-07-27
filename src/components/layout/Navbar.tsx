"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
  const otherLang = lang === "bs" ? "en" : "bs";

  // Strip lang prefix for active check
  const isHomePage = pathname === `/${lang}` || pathname === `/${lang}/`;
  const isActive = (key: string) => {
    if (key === "home") return isHomePage;
    if (key === "contact") return false;
    return pathname.includes(`/${lang}/${key}`);
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-colors ${
        isHomePage
          ? "border-b border-foreground-inverse/10 bg-transparent backdrop-blur-sm"
          : "border-b border-border-subtle bg-background/80 backdrop-blur-md"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-2.5 group" aria-label="Ruqya Healing Home">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <svg className="h-5 w-5 text-secondary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <span
              className={`text-lg font-heading font-bold hidden sm:inline ${
                isHomePage ? "text-foreground-inverse" : "text-foreground"
              }`}
            >
              {isBs ? "Ruqya" : "Ruqya"}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={`/${lang}${link.href}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.key)
                    ? isHomePage
                      ? "bg-foreground-inverse/15 text-foreground-inverse"
                      : "text-primary bg-accent"
                    : isHomePage
                      ? "text-foreground-inverse/90 hover:bg-foreground-inverse/10 hover:text-foreground-inverse"
                      : "text-foreground-muted hover:text-primary hover:bg-background-elevated"
                }`}
              >
                {isBs ? link.bs : link.en}
              </Link>
            ))}
          </div>

          {/* Right side: lang toggle + mobile hamburger */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <Link
              href={`/${otherLang}${pathname.replace(`/${lang}`, "") || ""}`}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                isHomePage
                  ? "border-foreground-inverse/30 bg-foreground-inverse/10 text-foreground-inverse hover:border-foreground-inverse/50 hover:bg-foreground-inverse/20"
                  : "border-border-subtle bg-card text-foreground-muted hover:border-secondary/50 hover:text-primary"
              }`}
              aria-label={`Switch to ${isBs ? "English" : "Bosnian"}`}
            >
              <span>{isBs ? "EN" : "BS"}</span>
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 16V4m0 0L3 8m4-4l4 4m6-4v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden rounded-lg p-2 transition-colors ${
                isHomePage
                  ? "text-foreground-inverse hover:bg-foreground-inverse/10"
                  : "text-foreground-muted hover:bg-background-elevated"
              }`}
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
          <div
            className={`mt-2 space-y-1 border-t pb-4 pt-4 md:hidden ${
              isHomePage ? "border-foreground-inverse/10" : "border-border-subtle"
            }`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={`/${lang}${link.href}`}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive(link.key)
                    ? isHomePage
                      ? "bg-foreground-inverse/15 text-foreground-inverse"
                      : "text-primary bg-accent"
                    : isHomePage
                      ? "text-foreground-inverse/90 hover:bg-foreground-inverse/10 hover:text-foreground-inverse"
                      : "text-foreground-muted hover:text-primary hover:bg-background-elevated"
                }`}
              >
                {isBs ? link.bs : link.en}
              </Link>
            ))}
            <div className="px-4 pt-2">
              <Link
                href={`/${otherLang}${pathname.replace(`/${lang}`, "") || ""}`}
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-card px-3 py-1.5 text-xs font-semibold text-foreground-muted hover:border-secondary/50 hover:text-primary transition-colors"
              >
                <span>{isBs ? "EN" : "BS"}</span>
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 16V4m0 0L3 8m4-4l4 4m6-4v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
