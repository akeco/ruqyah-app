"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { langMap, VALID_LANGUAGES, type PathLocale } from "@/lib/locale";
import { FlagBA, FlagGB } from "@/components/layout/FlagIcon";

const LANG_SHORT: Record<PathLocale, string> = {
  en: "EN",
  bs: "BS",
};

const FlagComponents: Record<PathLocale, typeof FlagGB> = {
  en: FlagGB,
  bs: FlagBA,
};

interface LanguageSwitcherProps {
  currentLang: string;
  className?: string;
  onNavigate?: () => void;
}

function buildLocaleHref(pathname: string, locale: PathLocale) {
  const segments = pathname.split("/").filter(Boolean);
  const rest = segments.slice(1).join("/");
  return `/${locale}${rest ? `/${rest}` : ""}`;
}

export function LanguageSwitcher({ currentLang, className = "", onNavigate }: LanguageSwitcherProps) {
  const pathname = usePathname();

  return (
    <div
      className={`inline-flex items-center rounded-full border border-border-subtle bg-card p-0.5 ${className}`}
      role="group"
      aria-label="Language"
    >
      {VALID_LANGUAGES.map((locale) => {
        const isActive = currentLang === locale;
        const Flag = FlagComponents[locale];

        return (
          <Link
            key={locale}
            href={buildLocaleHref(pathname, locale)}
            onClick={onNavigate}
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground-muted hover:bg-background-elevated hover:text-primary"
            }`}
            aria-current={isActive ? "true" : undefined}
            aria-label={langMap[locale].name}
          >
            <Flag />
            <span>{LANG_SHORT[locale]}</span>
          </Link>
        );
      })}
    </div>
  );
}
