import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { resolvePathLocale } from "@/lib/locale";

export default async function Home() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const locale = resolvePathLocale(
    cookieStore.get("site_lang")?.value,
    headerStore.get("accept-language") ?? undefined,
    headerStore.get("x-vercel-ip-country") ?? undefined,
  );

  redirect(`/${locale}`);
}
