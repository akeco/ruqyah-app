/**
 * URL locale segment used in routes (`/en/...`, `/bs/...`).
 * Cookie stores logical language: `site_lang=en|bos`.
 */
export type PathLocale = "en" | "bs";

export const VALID_LANGUAGES: PathLocale[] = ["en", "bs"];

export const langMap: Record<PathLocale, { code: string; name: string; dir: "ltr" | "rtl" }> = {
  en: { code: "en", name: "English", dir: "ltr" },
  bs: { code: "bs", name: "Bosanski", dir: "ltr" },
};

const BOS_COOKIE = "bos";

/** Map cookie value to URL segment */
export function pathLocaleFromSiteLang(cookie: string | undefined): PathLocale | null {
  if (cookie === "en") return "en";
  if (cookie === BOS_COOKIE) return "bs";
  return null;
}

function pathLocaleFromAcceptLanguage(header: string | undefined): PathLocale | null {
  if (!header) return null;

  const tags = header.split(",").map((part) => part.trim().split(";")[0].toLowerCase());
  for (const tag of tags) {
    const base = tag.split("-")[0];
    if (base === "bs" || base === "hr" || base === "sr" || base === "hbs") {
      return "bs";
    }
    if (base === "en") {
      return "en";
    }
  }
  return null;
}

function pathLocaleFromCountry(country: string | undefined): PathLocale | null {
  const c = country?.toUpperCase();
  if (!c) return null;
  if (c === "BA" || c === "HR" || c === "RS") {
    return "bs";
  }
  return null;
}

/**
 * Smart locale: persisted choice → Accept-Language → geo (BA/HR/RS) → English.
 */
export function resolvePathLocale(
  siteLangCookie: string | undefined,
  acceptLanguage: string | undefined,
  ipCountry: string | undefined,
): PathLocale {
  const fromCookie = pathLocaleFromSiteLang(siteLangCookie);
  if (fromCookie) return fromCookie;

  const fromAccept = pathLocaleFromAcceptLanguage(acceptLanguage);
  if (fromAccept) return fromAccept;

  const fromGeo = pathLocaleFromCountry(ipCountry);
  if (fromGeo) return fromGeo;

  return "en";
}
