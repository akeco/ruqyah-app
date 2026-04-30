import type { Metadata } from "next";
import LecturesLibraryPage from "@/app/lectures/LecturesLibraryPage";

export const metadata: Metadata = {
  title: "Lectures",
  description: "Browse all available lectures.",
  alternates: {
    canonical: "/en/lectures",
    languages: {
      en: "/en/lectures",
      bs: "/bs/lectures",
      "x-default": "/lectures",
    },
  },
};

export default async function EnglishLecturesPage() {
  return <LecturesLibraryPage language="en" />;
}
