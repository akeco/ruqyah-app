import { notFound } from "next/navigation";
import { Metadata } from "next";
import { VALID_LANGUAGES, langMap } from "@/lib/locale";
import { HeroSection } from "@/components/home/HeroSection";
import { WhatIsRuqya } from "@/components/home/WhatIsRuqya";
import { ConditionsWeHelp } from "@/components/home/ConditionsWeHelp";
import { PropheticRemedies } from "@/components/home/PropheticRemedies";
import { ConsultationProcess } from "@/components/home/ConsultationProcess";
import { FAQSection } from "@/components/home/FAQSection";
import { ContactForm } from "@/components/home/ContactForm";
import { ScrollReveal } from "@/components/ScrollReveal";

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

// Dynamic metadata
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const isBs = lang === "bs";

  return {
    title: isBs
      ? "Ruqya Liječenje Kur'anom | Urok, Sihr, Anksioznost i Poslanička Medicina"
      : "Ruqya Healing - Quran-Based Treatment for Evil Eye, Black Magic & Anxiety",
    description: isBs
      ? "Online audio i video rukja konsultacije za urok, sihr, vesvesu i anksioznost. Predavanja, audio recitacije i poslanička medicina (crni kim, med, hidžama) po Kur'anu i Sunnetu."
      : "Book online audio or video Ruqya consultations for the evil eye, black magic, waswas, and anxiety. Explore lectures, audio recitations, and prophetic remedies (black seed, honey, cupping) rooted in the Quran and Sunnah.",
    keywords: isBs
      ? "ruqya, rukja, kur'an, liječenje, duhovno iscjeljenje, urok, sihr, crna magija, vesvesa, hidžama, crni kim, poslanička medicina, online rukja, video konsultacija, audio rukja, dhikr, zikr"
      : "ruqya, ruqyah, quran healing, spiritual healing, evil eye treatment, black magic removal, sihr, waswas, jinn possession, prophetic medicine, black seed, hijama cupping, online ruqya consultation, video consultation, audio ruqya, dhikr, islamic healing",
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: "/en",
        bs: "/bs",
      },
    },
    openGraph: {
      title: isBs
        ? "Ruqya Liječenje Kur'anom | Urok, Sihr i Poslanička Medicina"
        : "Ruqya Healing - Evil Eye, Black Magic & Prophetic Medicine",
      description: isBs
        ? "Online audio i video rukja konsultacije, predavanja i poslanička medicina po Kur'anu i Sunnetu."
        : "Online audio and video Ruqya consultations, lectures, and prophetic remedies rooted in the Quran and Sunnah.",
      type: "website",
      locale: isBs ? "bs_BA" : "en_US",
    },
  };
}

export function generateStaticParams() {
  return VALID_LANGUAGES.map((lang) => ({ lang }));
}

// Server component
export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  if (!VALID_LANGUAGES.includes(lang as "en" | "bs")) {
    notFound();
  }

  const isBs = lang === "bs";

  return (
    <main className="min-h-screen">
      {/* ==================== HERO ==================== */}
      <HeroSection lang={lang} />

      {/* ==================== WHAT IS RUQYA ==================== */}
      <section
        id="what-is-ruqya"
        className="py-20 sm:py-28 bg-background"
        aria-labelledby="ruqya-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-semibold tracking-wide text-accent-foreground uppercase mb-4">
              {isBs ? "Edukacija" : "Education"}
            </span>
            <h2
              id="ruqya-heading"
              className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4"
            >
              {isBs ? "Šta je Ruqya?" : "What is Ruqya?"}
            </h2>
            <p className="text-foreground-muted leading-relaxed">
              {isBs
                ? "Ruqya je drevna islamska praksa iscjeljivanja koja koristi ajete iz Kur'ana i autentične dove za liječenje duhovnih, emocionalnih i fizičkih bolesti. Osnovana na Sunnetu Vjerovjesnika, sallallahu alejhi ve sellem."
                : "Ruqya is an ancient Islamic healing practice that uses verses from the Quran and authentic supplications to treat spiritual, emotional, and physical ailments. Rooted in the Sunnah of the Prophet ﷺ."}
            </p>
          </div>

          {/* Grid */}
          <WhatIsRuqya lang={lang} />
        </div>
      </section>

      {/* ==================== CONDITIONS WE HELP WITH ==================== */}
      <section
        id="conditions"
        className="py-20 sm:py-28 bg-background-elevated"
        aria-labelledby="conditions-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-semibold tracking-wide text-accent-foreground uppercase mb-4">
              {isBs ? "Duhovne Smetnje" : "Spiritual Ailments"}
            </span>
            <h2
              id="conditions-heading"
              className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4"
            >
              {isBs ? "Stanja i Smetnje Koje Liječimo" : "Conditions We Help With"}
            </h2>
            <p className="text-foreground-muted leading-relaxed">
              {isBs
                ? "Rukja se koristi za širok spektar duhovnih i emocionalnih smetnji prepoznatih u Kur'anu i Sunnetu. Svaka sesija se prilagođava vašoj konkretnoj situaciji."
                : "Ruqya is used to address a wide range of spiritual and emotional ailments recognized in the Quran and Sunnah. Every session is tailored to your specific situation."}
            </p>
          </div>

          <ConditionsWeHelp lang={lang} />
        </div>
      </section>

      {/* ==================== PROPHETIC REMEDIES & HERBS ==================== */}
      <section
        id="remedies"
        className="py-20 sm:py-28 bg-background"
        aria-labelledby="remedies-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-semibold tracking-wide text-accent-foreground uppercase mb-4">
              {isBs ? "Poslanička Medicina" : "Prophetic Medicine"}
            </span>
            <h2
              id="remedies-heading"
              className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4"
            >
              {isBs ? "Poslanička Medicina i Prirodni Lijekovi" : "Prophetic Remedies & Natural Herbs"}
            </h2>
            <p className="text-foreground-muted leading-relaxed">
              {isBs
                ? "Uz duhovno liječenje, Sunnet preporučuje prirodne lijekove i prakse koje podržavaju cjelokupno zdravlje tijela i duše. Ovo su najčešće preporučeni pristupi alternativne medicine iz poslaničke tradicije."
                : "Alongside spiritual healing, the Sunnah recommends natural remedies and practices that support overall health of body and soul. These are the most commonly recommended approaches to alternative medicine from the prophetic tradition."}
            </p>
          </div>

          <PropheticRemedies lang={lang} />
        </div>
      </section>

      {/* ==================== HOW CONSULTATIONS WORK ==================== */}
      <section
        id="consultations"
        className="py-20 sm:py-28 bg-background-elevated"
        aria-labelledby="consultations-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-semibold tracking-wide text-accent-foreground uppercase mb-4">
              {isBs ? "Kako Radimo" : "How It Works"}
            </span>
            <h2
              id="consultations-heading"
              className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4"
            >
              {isBs ? "Online Audio i Video Konsultacije" : "Online Audio & Video Consultations"}
            </h2>
            <p className="text-foreground-muted leading-relaxed">
              {isBs
                ? "Ne morate biti fizički prisutni da biste primili rukju. Naše konsultacije se odvijaju putem sigurnog audio ili video poziva, gdje god se nalazili."
                : "You don't need to be physically present to receive Ruqya. Our consultations take place over a secure audio or video call, wherever you are."}
            </p>
          </div>

          <ConsultationProcess lang={lang} />
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section
        id="faq"
        className="py-20 sm:py-28 bg-background"
        aria-labelledby="faq-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-semibold tracking-wide text-accent-foreground uppercase mb-4">
              {isBs ? "Česta Pitanja" : "FAQ"}
            </span>
            <h2
              id="faq-heading"
              className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4"
            >
              {isBs ? "Često Postavljana Pitanja o Rukji" : "Frequently Asked Questions About Ruqya"}
            </h2>
            <p className="text-foreground-muted leading-relaxed">
              {isBs
                ? "Odgovori na najčešća pitanja o rukji, duhovnim smetnjama i poslaničkoj medicini."
                : "Answers to the most common questions about Ruqya, spiritual ailments, and prophetic medicine."}
            </p>
          </div>

          <FAQSection lang={lang} />
        </div>
      </section>

      {/* ==================== CONTACT ==================== */}
      <section
        id="contact"
        className="py-20 sm:py-28 bg-background-elevated"
        aria-labelledby="contact-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left: info */}
            <div>
              <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-semibold tracking-wide text-accent-foreground uppercase mb-4">
                {isBs ? "Kontakt" : "Contact"}
              </span>
              <h2
                id="contact-heading"
                className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-6"
              >
                {isBs ? "Započnite svoj put ka izlječenju" : "Start Your Journey to Recovery"}
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-10">
                {isBs
                  ? "Imate pitanja o Ruqyi ili zelite zakazati konsultaciju? Popunite obrazac i naš tim će vam se javiti putem podataka koje ostavite."
                  : "Have questions about Ruqya or want to schedule a consultation? Fill out the form and our team will get back to you using the details you provide."}
              </p>

              <div className="space-y-6">
                <ScrollReveal delay={0}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent">
                      <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {isBs ? "Povjerljivo i s poštovanjem" : "Confidential & Respectful"}
                      </p>
                      <p className="text-sm text-foreground-muted">
                        {isBs
                          ? "Svaki razgovor se tretira uz potpunu privatnost i islamski adab."
                          : "Every conversation is treated with complete privacy and Islamic etiquette (adab)."}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={80}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent">
                      <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {isBs ? "Podrška na bosanskom i engleskom" : "English & Bosnian Support"}
                      </p>
                      <p className="text-sm text-foreground-muted">
                        {isBs
                          ? "Obratite nam se na jeziku koji vam odgovara — naš tim odgovara na jeziku na kojem se najugodnije osjećate."
                          : "Reach out in either language — our team replies in whichever one you're most comfortable with."}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={160}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent">
                      <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {isBs ? "Brz odgovor" : "Fast Response"}
                      </p>
                      <p className="text-sm text-foreground-muted">
                        {isBs
                          ? "Obično odgovaramo u roku od 24-48 sati kako bismo zakazali vašu audio ili video konsultaciju."
                          : "We typically respond within 24-48 hours to schedule your audio or video consultation."}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>

            {/* Right: form */}
            <ScrollReveal delay={0}>
              <ContactForm lang={lang} />
            </ScrollReveal>
          </div>
        </div>
      </section>
    </main>
  );
}
