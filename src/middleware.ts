import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEFAULT_LOCALE = "en";
const LOCALES = ["en", "bs"];

// Public paths that don't need locale prefixing (admin, API, etc.)
const PUBLIC_PATHS = ["/admin", "/api", "/_next", "/favicon", "/images", "/static"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, API routes, admin panel
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale prefix
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (pathnameHasLocale) {
    // Locale is already present — just update cookie if needed
    const cookieLocale = request.cookies.get("site_lang")?.value;
    const currentLocale = pathname.split("/")[1];

    if (cookieLocale && cookieLocale !== currentLocale) {
      const response = NextResponse.next();
      response.cookies.set("site_lang", currentLocale, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
        sameSite: "lax",
      });
      return response;
    }

    return NextResponse.next();
  }

  // No locale in pathname — redirect to default or detected locale
  const acceptedLocale = request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] || DEFAULT_LOCALE;
  const locale = LOCALES.includes(acceptedLocale) ? acceptedLocale : DEFAULT_LOCALE;

  // Redirect to localized URL
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt, llms.txt, llms-full.txt
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap\\.xml|robots\\.txt|llms\\.txt|llms-full\\.txt).*)",
  ],
};
