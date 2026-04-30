import { redirect } from "next/navigation";

export default async function LegacyEnglishLecturesPage() {
  redirect("/en/lectures");
}
