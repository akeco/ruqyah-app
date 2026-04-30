"use client";

import { useRouter } from "next/navigation";

type Language = "en" | "bos";

interface LanguageSwitcherProps {
  currentLanguage: Language;
}

/** URL segment (`/bs/`) — cookie stays `bos` for backwards compatibility */
function segmentFor(language: Language) {
  return language === "en" ? "en" : "bs";
}

export default function LanguageSwitcher({ currentLanguage }: LanguageSwitcherProps) {
  const router = useRouter();

  const setLanguage = (language: Language) => {
    document.cookie = `site_lang=${language}; path=/; max-age=31536000; samesite=lax`;
    router.push(`/${segmentFor(language)}/lectures`);
  };

  const baseButtonClass = "rounded-md px-3 py-1 text-xs font-medium transition-colors border";

  return (
    <div className="inline-flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`${baseButtonClass} ${
          currentLanguage === "en"
            ? "border-indigo-600 bg-indigo-50 text-indigo-700"
            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("bos")}
        className={`${baseButtonClass} ${
          currentLanguage === "bos"
            ? "border-indigo-600 bg-indigo-50 text-indigo-700"
            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
        }`}
      >
        BOS
      </button>
    </div>
  );
}
