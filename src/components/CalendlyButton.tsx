"use client";

import { useState } from "react";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

const CALENDLY_SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";
const CALENDLY_CSS_HREF = "https://assets.calendly.com/assets/external/widget.css";

let calendlyLoadPromise: Promise<void> | null = null;

function loadCalendlyWidget(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Calendly can only load in the browser"));
  }
  if (window.Calendly) return Promise.resolve();
  if (calendlyLoadPromise) return calendlyLoadPromise;

  if (!document.querySelector(`link[href="${CALENDLY_CSS_HREF}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = CALENDLY_CSS_HREF;
    document.head.appendChild(link);
  }

  calendlyLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CALENDLY_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Calendly")));
      return;
    }

    const script = document.createElement("script");
    script.src = CALENDLY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Calendly"));
    document.body.appendChild(script);
  });

  return calendlyLoadPromise;
}

interface CalendlyButtonProps {
  className?: string;
  children: React.ReactNode;
  errorLabel: string;
}

export function CalendlyButton({ className, children, errorLabel }: CalendlyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;

  const handleClick = async () => {
    if (!calendlyUrl) {
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);
    try {
      await loadCalendlyWidget();
      window.Calendly?.initPopupWidget({ url: calendlyUrl });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button type="button" onClick={handleClick} disabled={loading} className={className}>
        {children}
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{errorLabel}</p>}
    </div>
  );
}
