import type { Metadata } from "next";
import HomeContent from "@/components/home/HomeContent";

export const metadata: Metadata = {
  title: "Dobrodošli",
  description: "Pregledajte audio zapise i predavanja.",
  alternates: {
    canonical: "/bs",
    languages: {
      en: "/en",
      bs: "/bs",
      "x-default": "/",
    },
  },
};

export default function BosnianHomePage() {
  return <HomeContent locale="bs" />;
}
