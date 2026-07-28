# Ruqya Healing — Development Guide for AI Agents

## Project Overview
Multilingual (en/bs) Next.js web application for Islamic spiritual healing content. Brand: "Ruqya Healing". Delivers Quran-based healing (Ruqya), prophetic medicine, audio lectures, and wellness consulting.

## Commands
- `npm run dev` — Start dev server (Turbopack, port 3000)
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — ESLint check
- `npm run format` — Prettier format
- `npx prisma generate` — Generate Prisma client
- `npx prisma db push` — Push schema to database (dev)
- `npx prisma studio` — Open Prisma Studio GUI
- `npm run db:seed` — Run database seed script

## Environment Variables (Required)
- `DATABASE_URL` — PostgreSQL connection string (Prisma uses pg adapter)
- `NEXTAUTH_SECRET` — NextAuth encryption key
- `NEXTAUTH_URL` — Base URL for auth callbacks
- `SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL` — Supabase instance URL
- `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_SERVICE_ROLE` — Supabase admin key
- `NEXT_PUBLIC_SITE_URL` — Public site URL for sitemap generation

## Architecture

### Framework
- Next.js 15 App Router with Turbopack dev server
- TypeScript 5.9 with strict mode enabled
- Incremental compilation enabled
- Path alias: `@/*` maps to `./src/*`

### Database
- PostgreSQL with Prisma 7.8 and PrismaPg adapter
- Prisma client is singleton-patterned in `src/lib/prisma.ts` with globalThis caching
- Connection pool: max 20 connections, 30s idle timeout, 10s connect timeout
- Schema in `prisma/schema.prisma`

### Prisma Models (source of truth in prisma/schema.prisma)
- User: admin accounts (id, email, name, timestamps)
- Lecture: written content with bilingual fields (titleEn/Bs, contentEn/Bs, excerptEn/Bs, authorEn/Bs, categoryEn/Bs), slug, imageUrl, publishedAt
- Audio: recordings (titleEn/Bs, descriptionEn/Bs, slug, type: "lecture"|"ruqya", duration, url, youtubeUrl)

### Storage
- Supabase Storage bucket "rukja-audio" for audio files
- Supabase Storage bucket "images" for lecture cover images
- Both use service-role key for admin operations
- Upload retry: 3 attempts with network reset detection

### Authentication
- NextAuth v5 beta with Google provider only
- Handler at `/api/auth/[...nextauth]`
- Admin routes check `auth()` session; return 401 if unauthenticated

### i18n / Locale System
- Two locales: "en" and "bs" (Bosnian)
- Middleware in `src/middleware.ts`:
  - Cookie name: `site_lang` (maxAge 1 year, path "/", sameSite "lax")
  - Cookie value "en" maps to /en/...; cookie value "bos" maps to /bs/...
  - Accept-Language fallback: bs/hr/sr/hbs -> bs; en -> en
  - Geo fallback: BA/HR/RS -> bs
  - Default: en
  - Public paths skipped: /admin, /api, /_next, /favicon, /images, /static
  - Matcher: all paths except api, _next/static, _next/image, favicon.ico, sitemap.xml, robots.txt
  - Unlocalized paths redirect to detected locale
- Locale resolution in `src/lib/locale.ts`: resolvePathLocale(cookie, acceptLanguage, ipCountry)
- Root layout (src/app/layout.tsx): metadata with OpenGraph en_US, NextAuth SessionProvider
- Localized layout (src/app/[lang]/layout.tsx): JSON-LD Organization + WebSite schemas, alternates for en/bs, 404 for invalid locale

### Tailwind CSS 4
- Config in `tailwind.config.ts`
- Custom color scales: olive (50-950), gold (50-900), cream (50-500)
- CSS variables: --background: #F8F0E3, --foreground: #233227
- Typography: Marcellus (headings), Man伊斯兰 (body), Amiri (Arabic text)
- Islamic geometric pattern background class: .pattern-islamic
- Gold accent line class: .gold-line

## Routing Conventions

### App Router Structure
```
src/app/
  layout.tsx              # Root layout (metadata, SessionProvider)
  [lang]/
    layout.tsx            # Localized layout (JSON-LD, alternates)
    page.tsx              # Home page
    lectures/
      page.tsx            # Lecture listing
      [slug]/
        page.tsx          # Lecture detail
    audio/
      page.tsx            # Audio listing
      [slug]/
        page.tsx          # Audio detail
  api/
    lectures/route.ts     # GET: list lectures (public)
    lectures/[slug]/route.ts  # GET: single lecture (public)
    audio/route.ts        # GET: list audio (public)
    admin/
      lectures/route.ts   # GET/POST/PUT/DELETE: lecture CRUD (auth)
      lectures/upload/route.ts  # POST: lecture + image upload (auth)
      audios/route.ts     # GET: list audios (auth)
      audio/upload/route.ts     # POST: audio upload (auth)
      audio/[id]/route.ts   # PATCH/DELETE: audio update/delete (auth)
      lecture/[id]/route.ts # PUT/DELETE: lecture update/delete (auth)
    download/route.ts     # GET: stream/transcode audio to MP3 (public)
    auth/[...nextauth]/route.ts  # NextAuth handler
```

### Page Generation
- Static params generated for [lang] route: en and bs
- Static paths: "", "/lectures", "/audio" (changeFrequency: weekly/daily)
- Dynamic content (lectures/audio) fetched at build time via API with 1h revalidation

## API Conventions

### Public Endpoints (no auth)
- All return JSON with snake_case keys regardless of Prisma camelCase
- Accept `lang` query param (default "en") for bilingual content selection
- Error format: `{ "error": "message" }` with appropriate HTTP status
- GET /api/lectures: returns `{ "lectures": [...] }`
- GET /api/lectures/[slug]: returns `{ "lecture": {...} }` or 404
- GET /api/audio: returns `{ "audio": [...] }`
- GET /api/download: streams audio MP3, supports ffmpeg transcoding

### Admin Endpoints (auth required)
- Check `auth()` at start of every handler; return 401 if no session
- Lecture CRUD: POST creates, PUT updates, DELETE removes
- Audio CRUD: POST creates, PATCH updates, DELETE removes
- Upload endpoints use multipart/form-data
- YouTube URL validation: regex for youtube.com/watch?v=, /shorts/, /embed/, youtu.be/
- Audio file validation: mp3, wav, ogg, m4a, aac (MIME + extension check)
- Image upload: any image/* MIME type
- Supabase storage path extraction from public URLs uses `/storage/v1/object/public/<bucket>/` marker

### Download Endpoint
- Runtime: nodejs, dynamic: force-dynamic
- type=file: fetches from Supabase, validates hostname matches Supabase URL, streams or transcodes
- type=youtube: extracts video ID, uses youtube-dl-exec for stream URL, transcodes via ffmpeg
- ffmpeg set to ffmpeg-static path, transcodes to MP3 at 128kbps
- Sanitizes filenames: NFKD normalize, strip diacritics, lowercase, max 80 chars

## Development Rules

### TypeScript
- Strict mode: all types enforced, no implicit any
- Prisma types imported from @prisma/client for query inputs
- API route handlers use explicit type annotations for params and request
- Map Prisma result objects to snake_case before returning to frontend
- Never use `any` in application code; use `unknown` + type guards when necessary

### Prisma Query Patterns
- Always wrap in try/catch; return 500 with generic message on error
- Use `findUnique` with where clause (not raw queries)
- Use `findMany` with where + orderBy for list endpoints
- Slug-based lookups use `where: { slug }` (slug has @unique constraint)
- Pagination not yet implemented; consider adding skip/take for large datasets
- Defensive: check for null results after findUnique, return 404

### React/Next.js Patterns
- Use App Router server components by default
- Client components (use client) only for: audio player, form handling, auth context
- Dynamic metadata via generateMetadata() in layout files
- Static params via generateStaticParams() for [lang] route
- Fetch with next: { revalidate: N } for ISR caching
- NextResponse.json for API responses (not res.json)
- Path alias @/ for all internal imports (not relative paths)

### Styling
- Use Tailwind utility classes; avoid custom CSS unless reusable
- Custom CSS in src/app/globals.css: scrollbar, Islamic pattern, gold line, range input
- Color tokens: use olive-*, gold-*, cream-* Tailwind classes
- Background: cream-50 equivalent (#F6F1E9); foreground: olive-900 (#2D3627); accent: gold-600 (#C19853)
- Responsive: mobile-first; grid layouts collapse to single column on small screens
- Arabic text: use Amiri font via .arabic-text class

### File Organization
- Components in src/components/: home/, layout/, audio/ subdirectories
- Lib utilities in src/lib/: locale.ts, prisma.ts, auth.ts, fonts.ts, youtube.ts
- API routes in src/app/api/ grouped by domain (lectures, audio, admin)
- Static assets in public/: images/, audio/
- Seed data in prisma/seed.ts

### SEO
- Dynamic metadata per locale (title, alternates, OpenGraph locale)
- JSON-LD in localized layout: Organization + WebSite schemas
- Sitemap generated at build time via sitemap.ts (static + dynamic content)
- robots.ts disallows /admin and /api
- OpenGraph type: "website" (never "audio" — causes Next.js build error)
- Canonical alternates: /en and /bs mapped in generateMetadata

### Common Pitfalls
- Never use // comments inside JSX children — use {/* */} syntax
- Never use OpenGraph type "audio" — use "website"
- AudioPlayer props: accepts description and lang, NOT artist
- setImmediate/setTimeout needed for synchronous state updates inside useEffect
- Prisma slug field is nullable in schema but unique — always set on create
- Supabase service-role key must have role "service_role" not "anon"
- YouTube URL validation regex is strict — reject non-matching URLs early
- ffmpeg is set via setFfmpegPath at module load time, not per-request
- Cookie "bos" maps to locale "bs" in pathLocaleFromSiteLang, not "bs" directly
