interface RuqyaGridProps {
  lang: string;
}

const cards = {
  en: [
    {
      icon: "quran",
      title: "Ruqyah Shariah Treatment",
      desc: "Spiritual protection and therapy strictly in accordance with Islamic principles and Quranic recitation.",
    },
    {
      icon: "prophet",
      title: "Prophetic Remedies",
      desc: "Guidance on natural healing ingredients like black seed oil, pure honey, and olive leaf extracts.",
    },
    {
      icon: "heart",
      title: "Spiritual Counseling",
      desc: "Personalized advice to strengthen your faith, ease anxiety, and build healthy daily protective habits.",
    },
  ],
  bs: [
    {
      icon: "quran",
      title: "Liječenje Rukjom",
      desc: "Duhovna zaštita i terapija u potpunosti usklađena sa islamskim principima i učenjem Kur'ana.",
    },
    {
      icon: "prophet",
      title: "Proročanska medicina",
      desc: "Savjeti o upotrebi prirodnih lijekova poput ćurekotovog ulja, čistog meda i ekstrakta maslinovog lista.",
    },
    {
      icon: "heart",
      title: "Duhovno savjetovanje",
      desc: "Individualni savjeti za jačanje imana, ublažavanje tjeskobe i izgradnju svakodnevnih navika zaštite.",
    },
  ],
};

const iconMap: Record<string, React.ReactElement> = {
  quran: (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M12 6l-3 3 3 3" />
      <path d="M8 9h4" />
    </svg>
  ),
  prophet: (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  ),
  heart: (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
};

export function RuqyaGrid({ lang }: RuqyaGridProps) {
  const data = cards[lang === "bs" ? "bs" : "en"];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((card, i) => (
        <div
          key={i}
          className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md"
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 transition-colors group-hover:from-emerald-100 group-hover:to-emerald-200">
            {iconMap[card.icon]}
          </div>
          <h3 className="font-heading text-xl font-semibold text-emerald-950">{card.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">{card.desc}</p>
        </div>
      ))}
    </div>
  );
}
