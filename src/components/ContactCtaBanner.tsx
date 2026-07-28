import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";

interface ContactCtaBannerProps {
  lang: string;
  /** Defaults to the contact section on the home page (cross-page navigation). */
  href?: string;
  /** "banner" = full-bleed section (page break); "card" = rounded card for inline placement. */
  variant?: "banner" | "card";
  className?: string;
}

export function ContactCtaBanner({
  lang,
  href,
  variant = "banner",
  className = "",
}: ContactCtaBannerProps) {
  const isBs = lang === "bs";
  const contactHref = href || `/${lang}#contact`;

  const heading = isBs
    ? "Spremni da započnete put ka izlječenju?"
    : "Ready to Begin Your Healing Journey?";
  const body = isBs
    ? "Zakažite privatnu audio ili video rukja konsultaciju već danas i napravite prvi korak ka duhovnom i emocionalnom izlječenju."
    : "Book a private audio or video Ruqya consultation today and take the first step toward spiritual and emotional healing.";
  const cta = isBs ? "Zakažite konsultaciju" : "Book a Consultation";

  const content = (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground-inverse mb-4">
        {heading}
      </h2>
      <p className="text-foreground-inverse/80 leading-relaxed mb-8">{body}</p>
      <Link
        href={contactHref}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-8 py-3.5 text-base font-semibold text-secondary-foreground shadow-md hover:bg-secondary/90 transition-colors active:scale-[0.98]"
      >
        {cta}
      </Link>
    </div>
  );

  if (variant === "card") {
    return (
      <ScrollReveal className={className}>
        <div className="rounded-2xl bg-olive-900 px-6 py-12 sm:px-12 sm:py-14">{content}</div>
      </ScrollReveal>
    );
  }

  return (
    <section className={`bg-olive-900 py-16 sm:py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{content}</div>
    </section>
  );
}
