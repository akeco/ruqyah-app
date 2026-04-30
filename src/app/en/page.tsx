import type { Metadata } from "next";
import HomeContent from "@/components/home/HomeContent";

export const metadata: Metadata = {
  title: "Welcome",
  description: "Explore audio and lectures.",
  alternates: {
    canonical: "/en",
    languages: {
      en: "/en",
      bs: "/bs",
      "x-default": "/",
    },
  },
};

export default function EnglishHomePage() {
  return <HomeContent locale="en" />;
}
