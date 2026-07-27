import { ScrollReveal } from "@/components/ScrollReveal";

interface ConditionsWeHelpProps {
  lang: string;
}

const data = {
  en: [
    {
      icon: "eye",
      title: "The Evil Eye (Al-'Ayn)",
      description:
        "Ruqya treatment for the evil eye - a real spiritual affliction caused by envy or intense admiration, confirmed in authentic hadith. Symptoms may include unexplained fatigue, sudden illness, or a run of bad luck.",
    },
    {
      icon: "shield",
      title: "Black Magic (Sihr)",
      description:
        "Quranic recitation and prophetic supplications used to break the effects of sihr (black magic) and jinn-related harm, including marital discord, unexplained fear, and physical or emotional disturbance.",
    },
    {
      icon: "cloud",
      title: "Waswas & Intrusive Thoughts",
      description:
        "Guidance and recitation to calm waswas - the whispers of Shaytan - including obsessive doubts about faith, cleanliness, or relationships that cause ongoing distress.",
    },
    {
      icon: "heart",
      title: "Anxiety & Emotional Distress",
      description:
        "Complementary spiritual support for anxiety, sadness, and emotional heaviness through dhikr, dua, and Quranic recitation, used alongside - never instead of - professional medical or psychological care.",
    },
    {
      icon: "moon",
      title: "Sleep Disturbances & Nightmares",
      description:
        "Prophetic bedtime practices and protective recitations for restless sleep, recurring nightmares, and night terrors experienced by adults and children.",
    },
    {
      icon: "family",
      title: "Marital & Family Discord",
      description:
        "Ruqya and targeted dua for households affected by hasad (envy), sudden discord between spouses, or strained family relationships that resist ordinary explanation.",
    },
  ],
  bs: [
    {
      icon: "eye",
      title: "Urok (Al-'Ajn)",
      description:
        "Rukja tretman za urok - stvarnu duhovnu smetnju uzrokovanu zavišću ili prevelikim divljenjem, potvrđenu u vjerodostojnim hadisima. Simptomi mogu uključivati neobjašnjivu iscrpljenost, iznenadnu bolest ili niz nesretnih okolnosti.",
    },
    {
      icon: "shield",
      title: "Sihr (Crna magija)",
      description:
        "Kur'anska recitacija i poslaničke dove koje se koriste za poništavanje učinaka sihra i štete uzrokovane džinima, uključujući bračni nesklad, neobjašnjiv strah i fizičke ili emocionalne smetnje.",
    },
    {
      icon: "cloud",
      title: "Vesvesa i opsesivne misli",
      description:
        "Smjernice i recitacija za smirivanje vesvese - šejtanskih šaputanja - uključujući opsesivne sumnje o vjeri, čistoći ili odnosima koje uzrokuju trajnu tjeskobu.",
    },
    {
      icon: "heart",
      title: "Anksioznost i emocionalna tjeskoba",
      description:
        "Komplementarna duhovna podrška za anksioznost, tugu i emocionalnu težinu kroz zikr, dovu i kur'ansku recitaciju - uz, a nikako umjesto, profesionalne medicinske ili psihološke njege.",
    },
    {
      icon: "moon",
      title: "Poremećaji sna i noćne more",
      description:
        "Poslaničke prakse prije spavanja i zaštitne recitacije za nemiran san, ponavljajuće noćne more i noćne strahove kod odraslih i djece.",
    },
    {
      icon: "family",
      title: "Bračni i porodični nesklad",
      description:
        "Rukja i ciljana dova za domaćinstva pogođena hasedom (zavišću), iznenadnim neskladom među supružnicima ili narušenim porodičnim odnosima koji se opiru uobičajenom objašnjenju.",
    },
  ],
};

const iconMap: Record<string, React.ReactNode> = {
  eye: (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  shield: (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  cloud: (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h.79a4.5 4.5 0 1 1 1 8.9z" />
    </svg>
  ),
  heart: (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  moon: (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  family: (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="9" cy="7" r="3" />
      <circle cx="17" cy="8" r="2.5" />
      <path d="M2 21v-1a6 6 0 0 1 12 0v1" />
      <path d="M14.5 21v-.5a5 5 0 0 1 7.5-4.33" />
    </svg>
  ),
};

export function ConditionsWeHelp({ lang }: ConditionsWeHelpProps) {
  const isBs = lang === "bs";
  const items = data[isBs ? "bs" : "en"];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, i) => (
        <ScrollReveal key={i} delay={i * 80}>
          <div className="rounded-xl border border-border-subtle bg-card p-6 hover:border-secondary/50 hover:shadow-md transition-all">
            <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center text-primary mb-4">
              {iconMap[item.icon]}
            </div>
            <h3 className="text-lg font-heading font-bold text-foreground mb-2">{item.title}</h3>
            <p className="text-sm text-foreground-muted leading-relaxed">{item.description}</p>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
