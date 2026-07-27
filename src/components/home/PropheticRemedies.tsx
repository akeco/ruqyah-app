import { ScrollReveal } from "@/components/ScrollReveal";

interface PropheticRemediesProps {
  lang: string;
}

const data = {
  en: [
    {
      icon: "seed",
      title: "Black Seed (Habbatus Sawda)",
      description:
        "The Prophet ﷺ described black seed as a remedy for every ailment except death. Nigella sativa oil is used traditionally to support the immune system and general wellness.",
    },
    {
      icon: "honey",
      title: "Pure Honey",
      description:
        "Described in the Quran as containing healing for people, raw honey is used in prophetic medicine to support digestion and soothe the respiratory system.",
    },
    {
      icon: "leaf",
      title: "Olive Oil & Olive Leaf",
      description:
        "The olive tree is called a blessed tree in the Quran. Its oil and leaf extract are used topically and in food for skin, hair, and overall nourishment.",
    },
    {
      icon: "cup",
      title: "Hijama (Cupping Therapy)",
      description:
        "A prophetic practice using suction cups on specific points of the body to encourage circulation, traditionally performed on recommended days of the lunar month.",
    },
    {
      icon: "bowl",
      title: "Talbina (Barley Porridge)",
      description:
        "A soothing barley-and-honey porridge the Prophet ﷺ recommended for comfort during grief, illness, and emotional distress.",
    },
    {
      icon: "water",
      title: "Zamzam Water",
      description:
        "Water from the sacred Zamzam well in Makkah, traditionally consumed with the intention of healing (shifa), as taught in the Sunnah.",
    },
  ],
  bs: [
    {
      icon: "seed",
      title: "Crni kim (Habbetu Sevda)",
      description:
        "Poslanik ﷺ je opisao crni kim kao lijek za svaku bolest osim smrti. Ulje crnog kima se tradicionalno koristi za jačanje imunološkog sistema i opće zdravlje.",
    },
    {
      icon: "honey",
      title: "Čisti med",
      description:
        "Med je u Kur'anu opisan kao lijek za ljude. U poslaničkoj medicini koristi se za podršku probavi i umirivanje disajnih puteva.",
    },
    {
      icon: "leaf",
      title: "Maslinovo ulje i list masline",
      description:
        "Maslina se u Kur'anu naziva blagoslovljenim drvetom. Njeno ulje i ekstrakt lista koriste se lokalno i u ishrani za njegu kože, kose i opću ishranu tijela.",
    },
    {
      icon: "cup",
      title: "Hidžama (Kupiranje)",
      description:
        "Poslanička praksa koja koristi čašice na određenim tačkama tijela radi podsticanja cirkulacije, tradicionalno se izvodi na preporučene dane lunarnog mjeseca.",
    },
    {
      icon: "bowl",
      title: "Telbina (Ječmena kaša)",
      description:
        "Umirujuća kaša od ječma i meda koju je Poslanik ﷺ preporučio kao utjehu u tuzi, bolesti i emocionalnoj tjeskobi.",
    },
    {
      icon: "water",
      title: "Zemzem voda",
      description:
        "Voda sa svetog izvora Zemzem u Meki, tradicionalno se konzumira s namjerom iscjeljenja (šifa), kako je poučeno u Sunnetu.",
    },
  ],
};

const iconMap: Record<string, React.ReactNode> = {
  seed: (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2C7 6 4 11 4 15a8 8 0 0 0 16 0c0-4-3-9-8-13z" />
      <path d="M12 9v11" />
    </svg>
  ),
  honey: (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 2h8l1 4-1 4-1 4 1 4-1 4H8l-1-4 1-4-1-4 1-4z" />
    </svg>
  ),
  leaf: (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M11 20A7 7 0 0 1 4 13c0-4 3-9 10-11 1 6 1 10-1 13a7 7 0 0 1-2 5z" />
      <path d="M4 13c4 0 8 2 8 7" />
    </svg>
  ),
  cup: (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 3h12l-1.5 12a4.5 4.5 0 0 1-9 0z" />
      <path d="M9 21h6" />
    </svg>
  ),
  bowl: (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 12h18a9 6 0 0 1-18 0z" />
      <path d="M7 12V8a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  water: (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  ),
};

export function PropheticRemedies({ lang }: PropheticRemediesProps) {
  const isBs = lang === "bs";
  const items = data[isBs ? "bs" : "en"];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, i) => (
        <ScrollReveal key={i} delay={i * 80}>
          <div className="group rounded-xl border border-border-subtle bg-card p-6 hover:border-secondary/50 hover:shadow-md transition-all">
            <div className="h-12 w-12 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary mb-4">
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
