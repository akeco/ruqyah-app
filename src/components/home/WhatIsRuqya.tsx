import { ScrollReveal } from "@/components/ScrollReveal";

interface WhatIsRuqyaProps {
  lang: string;
}

const gridData = {
  en: [
    {
      icon: "quran",
      title: "Quranic Foundation",
      description: "Ruqya is grounded in the verses of the Quran, particularly Surah Al-Fatiha, Ayat al-Kursi, and the Mu'awwidhatayn (Surahs Al-Falaq and An-Nas).",
    },
    {
      icon: "heart",
      title: "Spiritual Wellness",
      description: "Addresses spiritual ailments such as envy, the evil eye, and negative energies through authentic prophetic supplications and recitations.",
    },
    {
      icon: "water",
      title: "Healing Water (Ma' al-Tayyib)",
      description: "Recitation over water following the Sunnah method, where the blessed water is consumed or used for bathing as a form of spiritual purification.",
    },
    {
      icon: "book",
      title: "Prophetic Sunnah",
      description: "Follows the methodology of Prophet Muhammad ﷺ in treating spiritual illness - combining recitation, supplication, and divine permission.",
    },
    {
      icon: "peace",
      title: "Inner Peace",
      description: "The rhythmic recitation of Quranic verses brings tranquility to the heart, reduces anxiety, and restores emotional balance through divine remembrance.",
    },
    {
      icon: "shield",
      title: "Divine Protection",
      description: "Regular Ruqya builds a spiritual shield around a person and their home, guarding against the evil eye, black magic, and the whispers of Shaytan before they take hold.",
    },
  ],
  bs: [
    {
      icon: "quran",
      title: "Kur'anski Temelj",
      description: "Ruqya se zasniva na ajetima Kur'ana, posebno El-Fatihi, Ajetu prijestolja i Mu'awwidhatayn (El-Felak i En-Nas).",
    },
    {
      icon: "heart",
      title: "Duhovno Zdravlje",
      description: "Bavi se duhovnim bolestima kao što su zavist, zli oko i negativne energije kroz autentične dove i recitacije.",
    },
    {
      icon: "water",
      title: "Voda Liječnica (Ma' al-Tayyib)",
      description: "Recitacija nad vodom prema Sunnet metodi, gdje se blagoslovljena voda pije ili koristi za kupanje kao oblik duhovnog pročišćenja.",
    },
    {
      icon: "book",
      title: "Prorocka Sunnet",
      description: "Prati metodologiju Poslanika, sallallahu alejhi ve sellem, u liječenju duhovnih bolesti - kombinacija recitacije, dove i Božije dozvole.",
    },
    {
      icon: "peace",
      title: "Unutrasnji Mir",
      description: "Ritam recitacije kur'anskih ajeta donosi smirenost srcu, smanjuje anksioznost i uspostavlja emocionalnu ravnotežu kroz Božije sjecanje.",
    },
    {
      icon: "shield",
      title: "Božija Zaštita",
      description: "Redovna rukja gradi duhovni štit oko osobe i njenog doma, čuvajući od uroka, sihra i šejtanskih šaputanja prije nego što se ukorijene.",
    },
  ],
};

export function WhatIsRuqya({ lang }: WhatIsRuqyaProps) {
  const isBs = lang === "bs";
  const data = gridData[isBs ? "bs" : "en"];

  const iconMap: Record<string, React.ReactNode> = {
    quran: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M8 7h8" />
        <path d="M8 11h6" />
      </svg>
    ),
    heart: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    water: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
    book: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    shield: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    peace: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item, i) => (
        <ScrollReveal key={i} delay={i * 80}>
          <div className="group rounded-xl border border-border-subtle bg-card p-6 hover:border-secondary/50 hover:shadow-md transition-all">
            {/* Icon */}
            <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center text-primary mb-4 transition-all">
              {iconMap[item.icon]}
            </div>

            {/* Title */}
            <h3 className="text-lg font-heading font-bold text-foreground mb-2">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-foreground-muted leading-relaxed">
              {item.description}
            </p>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
