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
import { ContactMessagingButtons } from "@/components/home/ContactMessagingButtons";
import { CalendlyButton } from "@/components/CalendlyButton";
import { ContactCtaBanner } from "@/components/ContactCtaBanner";
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
      ? "Mehlem Clinic | Rukja, Poslanička Medicina i Psiholoska Podrska po Kur'anu i Sunnetu"
      : "Mehlem Clinic - Ruqya, Prophetic Medicine & Islamic Psychological Support",
    description: isBs
      ? "Mehlem Clinic je online islamska klinika za urok, sihr, vesvesu, anksioznost i emocionalnu tjeskobu. Nudimo audio/video rukja konsultacije, psiholosku podrsku utemeljenu na islamskim principima, poslaničku medicinu (crni kim, med, hidžama) i biljne lijekove po Kur'anu i Sunnetu, na bosanskom i engleskom jeziku."
      : "Mehlem Clinic is an online Islamic clinic treating the evil eye, black magic, waswas, anxiety, and emotional distress. We offer audio/video Ruqya consultations, Islamic-rooted psychological and emotional wellness support, prophetic medicine (black seed, honey, hijama), and herbal remedies from the Quran and Sunnah, in English and Bosnian.",
    keywords: isBs
      ? "Mehlem Clinic, ruqya, rukja, kur'an, liječenje, duhovno iscjeljenje, urok, sihr, crna magija, vesvesa, hidžama, crni kim, poslanička medicina, psiholoska podrska, anksioznost, online rukja, video konsultacija, audio rukja, dhikr, zikr, biljni lijekovi"
      : "Mehlem Clinic, ruqya, ruqyah, quran healing, spiritual healing, evil eye treatment, black magic removal, sihr, waswas, jinn possession, prophetic medicine, black seed, hijama cupping, islamic psychological consultation, anxiety support, online ruqya consultation, video consultation, audio ruqya, dhikr, islamic healing, herbal remedies",
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: "/en",
        bs: "/bs",
      },
    },
    openGraph: {
      title: isBs
        ? "Mehlem Clinic | Rukja, Poslanička Medicina i Psiholoska Podrska"
        : "Mehlem Clinic - Ruqya, Prophetic Medicine & Islamic Psychological Support",
      description: isBs
        ? "Online rukja konsultacije, psiholoska podrska, poslanička medicina i biljni lijekovi po Kur'anu i Sunnetu."
        : "Online Ruqya consultations, Islamic psychological support, prophetic medicine, and herbal remedies rooted in the Quran and Sunnah.",
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

      {/* ==================== MID-PAGE CTA ==================== */}
      <ContactCtaBanner lang={lang} href="#contact" />

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

                <ScrollReveal delay={240}>
                  <ContactMessagingButtons lang={lang} />
                </ScrollReveal>
              </div>
            </div>

            {/* Right: Calendly + form */}
            <ScrollReveal delay={0}>
              <div className="space-y-6">
                <div className="rounded-2xl border border-border-subtle bg-card p-6 sm:p-8 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent">
                      <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {isBs ? "Zakažite konsultaciju" : "Schedule a Consultation"}
                      </p>
                      <p className="mt-1 text-sm text-foreground-muted">
                        {isBs
                          ? "Odaberite termin koji vam odgovara direktno u našem kalendaru - bez čekanja na odgovor."
                          : "Pick a time that works for you directly in our calendar - no waiting for a reply."}
                      </p>
                      <CalendlyButton
                        errorLabel={
                          isBs
                            ? "Kalendar trenutno nije dostupan. Molimo koristite obrazac ispod."
                            : "Calendar is currently unavailable. Please use the form below."
                        }
                        className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-6 py-2.5 text-sm font-semibold text-secondary-foreground shadow-sm hover:bg-secondary/90 transition-colors active:scale-[0.98] disabled:opacity-60 disabled:cursor-wait"
                      >
                        {isBs ? "Zakažite putem Calendly-ja" : "Schedule via Calendly"}
                      </CalendlyButton>
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center">
                  <div className="flex-grow border-t border-border-subtle" />
                  <span className="mx-4 text-sm font-semibold uppercase tracking-wide text-foreground-muted">
                    {isBs ? "Ili" : "Or"}
                  </span>
                  <div className="flex-grow border-t border-border-subtle" />
                </div>

                <ContactForm lang={lang} />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </main>
  );
}
