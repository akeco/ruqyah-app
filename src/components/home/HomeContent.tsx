import Image from "next/image";
import Link from "next/link";
import type { PathLocale } from "@/lib/locale";

const copy = {
  en: {
    title: "Welcome",
    subtitle: "Choose a section to explore.",
    audio: "Audio library",
    lectures: "Lectures",
  },
  bs: {
    title: "Dobrodošli",
    subtitle: "Izaberite dio sadržaja koji želite pregledati.",
    audio: "Audio biblioteka",
    lectures: "Predavanja",
  },
} as const;

export default function HomeContent({ locale }: { locale: PathLocale }) {
  const t = copy[locale === "bs" ? "bs" : "en"];

  return (
    <div className="bg-background font-[family-name:var(--font-geist-sans)]">
      <main>
        <Image
          src="/images/hero-image.webp"
          alt="Hero book"
          width={300}
          height={300}
          priority
        />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t.title}</h1>
          <p className="mt-2 text-sm text-gray-600">{t.subtitle}</p>
        </div>
      </main>
    </div>
  );
}
