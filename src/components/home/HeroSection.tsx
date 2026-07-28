"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface HeroSectionProps {
  lang: string;
}

const HERO_IMAGE = {
  src: "/images/hero-leaf-book.webp",
  width: 1920,
  height: 1080,
} as const;

const PARALLAX_FACTOR = 0.38;

export function HeroSection({ lang }: HeroSectionProps) {
  const isBs = lang === "bs";
  const sectionRef = useRef<HTMLElement>(null);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const updateParallax = () => {
      const section = sectionRef.current;
      if (!section) return;

      const { top, height } = section.getBoundingClientRect();
      if (top > window.innerHeight || top + height < 0) return;

      const scrolled = Math.max(0, -top);
      setParallaxY(scrolled * PARALLAX_FACTOR);
    };

    updateParallax();
    window.addEventListener("scroll", updateParallax, { passive: true });
    window.addEventListener("resize", updateParallax);

    return () => {
      window.removeEventListener("scroll", updateParallax);
      window.removeEventListener("resize", updateParallax);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden" aria-labelledby="hero-heading">
      <div className="relative">
        <Image
          src={HERO_IMAGE.src}
          alt=""
          width={HERO_IMAGE.width}
          height={HERO_IMAGE.height}
          priority
          className="invisible block h-auto w-full"
          aria-hidden
        />

        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div
            className="absolute inset-x-0 -top-[10%] will-change-transform"
            style={{ transform: `translate3d(0, ${parallaxY}px, 0)` }}
          >
            <Image
              src={HERO_IMAGE.src}
              alt=""
              width={HERO_IMAGE.width}
              height={HERO_IMAGE.height}
              priority
              className="block h-auto w-full scale-[1.12] origin-top"
            />
          </div>
        </div>
      </div>

      {/* Scrim behind the text only — fades out before the leaf/book so the image stays clear on the right */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-background from-0% via-background/85 via-35% to-transparent to-65%"
        aria-hidden
      />

      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Left column — logo + CTA */}
            <div>
              <h1 id="hero-heading" className="sr-only">
                {isBs ? "Mehlem Klinika — Islamsko iscjeljenje i wellness" : "Mehlem Clinic — Islamic Healing & Wellness"}
              </h1>

              <Image
                src="/images/mehlem-clinic-logo.webp"
                alt={isBs ? "Mehlem Klinika — Islamsko iscjeljenje i wellness" : "Mehlem Clinic — Islamic Healing & Wellness Clinic"}
                width={546}
                height={507}
                className="mb-8 h-auto w-72 sm:w-80 lg:w-96"
              />

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
