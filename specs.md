Project Specification: Ruqya Platform (Public Frontend)
1. Project Overview & Context
Tech Stack: Next.js (App Router), Tailwind CSS, TypeScript.

Domain: Islamic Spiritual Healing (Ruqya / Liječenje Kur'anom).

Target Audience: People seeking spiritual healing, education on Ruqya, and authentic Islamic lectures/audio.

Current State: Admin panel is completed (handles lecture generation in EN/BS, and audio lecture uploads).

Task: Implement the public-facing pages (Homepage, Lectures List/Detail, Audio Player) with bilingual support (EN/BS), modern Islamic green-themed UI, and advanced SEO/AI-crawler optimization.

## 1.3 Routing & Internationalization (i18n) Structure
The application uses Next.js localized routing via a language parameter folder `[lang]`. The codebase must strictly follow this page hierarchy to separate English (en) and Bosnian (bs) views:

app/
└── [lang]/
    ├── layout.tsx             # Shared layout with dynamic lang HTML attribute
    ├── page.tsx               # Homepage (Localized Hero, Sections, Contact)
    ├── lectures/
    │   ├── page.tsx           # Lectures List (Filtered by lang)
    │   └── [slug]/
    │       └── page.tsx       # Lecture Detail View
    └── audio/
        └── page.tsx           # Audio Lectures List & Player

2. Design & UI Guidelines (Islamic Theme)
Color Palette: * Primary: Emerald/Deep Green (emerald-800, emerald-950) representing Islamic tradition and peace.

Secondary: Warm Gold/Amber (amber-500, amber-600) for accents, dividers, and highlights.

Backgrounds: Soft off-white (slate-50, stone-50) and deep dark green for dark mode elements.

Typography: Elegant serif for headings (e.g., Playfair Display or Garamond if available, fallback to standard serif) and clean sans-serif for readable body text.

Visual Elements: Subtle geometric patterns, elegant dividers, cards with soft shadows, and smooth transitions.

3. SEO & AI Agent Optimization (Critical)
The platform must be easily crawlable by traditional search engines (Google) and readable by AI Agents (LLM crawlers like OpenAI, Perplexity, Anthropic).

Metadata & OpenGraph: Implement dynamic metadata for all pages (titles, descriptions in both EN and BS).

Structured Data (JSON-LD): * Homepage: Organization and WebSite schema.

Lectures: Article or BlogPosting schema.

Audio: AudioObject or PodcastEpisode schema.

Semantic HTML: Use strict semantic tags (<main>, <article>, <section>, <nav>, <aside>) so AI parsers can easily extract the core context without noise.

AI-Friendly Hints: Include hidden or standard accessible semantic contexts (e.g., aria-labels and clear heading hierarchies) that explicitly state the purpose of the Ruqya content.

4. Page-by-Page Requirements
4.1 Homepage (/ or /[lang])
Hero Section: * An engaging, peaceful background (emerald green gradient).

A prominent call-to-action (CTA) like "Start Healing Journey" or "Explore Lectures".

A beautifully formatted, authentic Quranic verse placeholder about healing (e.g., Surah Al-Isra, 17:82) in Arabic, English, and Bosnian.

Core Sections:

What is Ruqya? (Šta je Rukja?): Brief educational grid explaining authentic vs. unauthorized healing.

Latest Lectures & Audios: Dynamic preview cards fetching the latest 3 items from the API.

Self-Protection Steps (Added Value): A visual checklist/stepper for daily Adhkar (protection prayers).

Contact Form Section:

Fields: Name, Email, Subject, Message.

Action: Submits via API route. Use dummy-receiver@example.com as a placeholder for the destination email.

Footer: Standard links, copyright, and a sensitive disclaimer stating that Ruqya is a spiritual complement to, not a replacement for, medical science.

4.2 Lectures Page
The application uses Next.js localized routing via a language parameter folder `[lang]`. The codebase must strictly follow this page hierarchy to separate English (en) and Bosnian (bs) views:

app/
└── [lang]/
    ├── layout.tsx             # Shared layout with dynamic lang HTML attribute
    ├── page.tsx               # Homepage (Localized Hero, Sections, Contact)
    ├── lectures/
    │   ├── page.tsx           # Lectures List (Filtered by lang)
    │   └── [slug]/
    │       └── page.tsx       # Lecture Detail View
    └── audio/
        └── page.tsx           # Audio Lectures List & Player
List Page (/lectures):

Fetches lectures from the API.

Features a language toggle or filters automatically based on current locale (EN/BS).

Grid layout of cards showing: Title, short description, date, and a "Read More" button.

Detail Page (/lectures/[slug]):

Clean typography layout optimized for distraction-free reading (max-width prose).

Includes a sidebar or top banner with authentic Duas for healing related to the lecture topic.

Proper JSON-LD injection for the article body.

4.3 Audio Page (/audio)
Audio List & Player:

Fetches audio data from the API (Title, Reciter/Speaker, Duration, Audio URL, Description).

Custom/Sticky Audio Player: A beautiful persistent audio player at the bottom of the screen (or highly polished inline player) that supports play, pause, seek, volume control, and speed adjustment (useful for listening to long Ruqya recitations).

Categorization: Separate audios into "Educational Lectures" and "Ruqya Recitations (Audio Tretman)" so users can easily stream targeted healing verses.

5. Domain-Specific Enhancements (Added Value)
To elevate the application and make it a complete resource, the models should include placeholders/UI setups for:

Symptom Checker / Assessment Guide: A non-diagnostic, educational questionnaire that helps users understand if they need general spiritual strengthening or targeted Ruqya based on traditional Islamic literature.

Daily Adhkar Checklist: An interactive component on the homepage or a standalone section where users can check off their morning and evening protection prayers.

Emergency Authenticity Guide: A quick-reference guide on how to spot scammers/magicians (Sihr practitioners) versus authentic Raqis (prophetic healers).

6. Technical API Integration Instructions (For Hermes/Qwen)
Assume the backend APIs return data in the following formats:

/api/lectures -> { id, title_en, title_bs, content_en, content_bs, slug, createdAt }

/api/audios -> { id, title_en, title_bs, url, duration, speaker, type: 'ruqya' | 'lecture' }

Implement clean loading states (skeletons) and error boundaries using Next.js native loading.tsx and error.tsx architecture.

Ensure absolute separation of localized strings using a simple client/server dictionary approach or standard Next.js internationalization (i18n) routing patterns.