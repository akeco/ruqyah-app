import type { Metadata } from "next";
import LecturesLibraryPage from "@/app/lectures/LecturesLibraryPage";

export const metadata: Metadata = {
  title: "Predavanja",
  description: "Pregledajte sva dostupna predavanja.",
  alternates: {
    canonical: "/bs/lectures",
    languages: {
      en: "/en/lectures",
      bs: "/bs/lectures",
      "x-default": "/lectures",
    },
  },
};

export default async function BosnianLecturesPage() {
  return <LecturesLibraryPage language="bos" />;
}
