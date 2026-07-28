"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function NotFound() {
  const searchParams = useSearchParams();
  const lang = (searchParams.get("lang") as "en" | "bs") || "en";
  const isBs = lang === "bs";

  return (
    <div className="min-h-screen flex items-center justify-center bg-olive-900 px-4">
      <div className="text-center max-w-md">
        {/* 404 icon */}
        <div className="mx-auto h-24 w-24 rounded-full bg-foreground-inverse/10 flex items-center justify-center mb-8">
          <span className="text-5xl font-heading font-bold text-secondary">404</span>
        </div>

        <h1 className="text-2xl font-heading font-bold text-foreground-inverse mb-4">
          {isBs ? "Stranica nije pronađena" : "Page Not Found"}
        </h1>
        <p className="text-foreground-inverse/60 mb-8">
          {isBs
            ? "Trazena stranica ne postoji ili je pomjerena."
            : "The page you are looking for does not exist or has been moved."}
        </p>

        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground shadow-lg hover:bg-secondary/90 transition-all"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {isBs ? "Povratak na Pocetnu" : "Back to Home"}
        </Link>
      </div>
    </div>
  );
}
