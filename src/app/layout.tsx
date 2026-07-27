import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { fontClassNames } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ruqya Healing - Quran-Based Spiritual Healing",
  description: "Discover the healing power of the Quran. Ruqya services, lectures, and audio recordings for mental and emotional wellness.",
  keywords: "ruqya, quran healing, spiritual healing, islamic healing, koran, iscjeljenje",
  openGraph: {
    title: "Ruqya Healing - Quran-Based Spiritual Healing",
    description: "Discover the healing power of the Quran.",
    type: "website",
    locale: "en_US",
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
