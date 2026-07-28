import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { fontClassNames } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mehlem-clinic.com"),
  title: "Mehlem Clinic - Islamic Healing Through Quran, Sunnah & Prophetic Medicine",
  description:
    "Mehlem Clinic is an online Islamic healing practice offering Ruqya (Quranic healing), Sunnah-based prophetic remedies, herbal guidance, and psychological/emotional wellness consultations rooted in Islamic tradition. Book audio or video sessions in English or Bosnian.",
  keywords:
    "Mehlem Clinic, ruqya, quran healing, spiritual healing, islamic healing, prophetic medicine, islamic psychological consultation, evil eye, black magic, waswas, hijama, black seed, koran, iscjeljenje",
  applicationName: "Mehlem Clinic",
  openGraph: {
    siteName: "Mehlem Clinic",
    title: "Mehlem Clinic - Islamic Healing Through Quran, Sunnah & Prophetic Medicine",
    description:
      "Online Ruqya consultations, prophetic medicine guidance, and Islamic psychological wellness support rooted in the Quran and Sunnah.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mehlem Clinic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mehlem Clinic - Islamic Healing Through Quran, Sunnah & Prophetic Medicine",
    description:
      "Online Ruqya consultations, prophetic medicine guidance, and Islamic psychological wellness support rooted in the Quran and Sunnah.",
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontClassNames} suppressHydrationWarning>
      <body className={`${fontClassNames} font-body antialiased pattern-islamic`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
