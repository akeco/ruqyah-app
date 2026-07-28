import Image from "next/image";
import Link from "next/link";

interface HeroSectionProps {
  lang: string;
}

export function HeroSection({ lang }: HeroSectionProps) {
  const isBs = lang === "bs";

  return (
    <section className="relative w-full" aria-labelledby="hero-heading">
      <Image
        src="/images/hero-leaf-book.webp"
        alt=""
        width={1920}
        height={1080}
        priority
        className="block h-auto w-full"
        aria-hidden
      />

      {/* Scrim behind the text only — fades out before the leaf/book so the image stays clear on the right */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-background from-0% via-background/85 via-35% to-transparent to-65%"
        aria-hidden
      />

      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Left column — text */}
            <div>
              <h1
                id="hero-heading"
                className="mb-6 font-heading text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl"
              >
                {isBs ? (
                  <>
                    Autentično duhovno liječenje
                    <br />
                    i poslanička medicina
                  </>
                ) : (
                  <>
                    Authentic Spiritual Healing
                    <br />
                    and Prophetic Medicine
                  </>
                )}
              </h1>

              <p className="mb-8 max-w-xl text-base leading-relaxed text-foreground-muted sm:text-lg">
                {isBs
                  ? "Pronađite mir, zaštitu i cjelovito blagostanje kroz ispravnu Rukju i prirodne lijekove iz Sunneta."
                  : "Discover peace, protection, and holistic well-being through authentic Ruqyah Shariah and natural remedies from the Sunnah."}
              </p>

              <Link
                href={`/${lang}#contact`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-colors active:scale-[0.98]"
              >
                {isBs ? "Zakažite savjetovanje" : "Book a Consultation"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
