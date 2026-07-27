"use client";

import { useState, type FormEvent } from "react";

interface ContactFormProps {
  lang: string;
}

export function ContactForm({ lang }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const isBs = lang === "bs";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !message.trim()) {
      setError(isBs ? "Molimo popunite sva obavezna polja." : "Please fill in all required fields.");
      return;
    }

    if (!email.trim() && !phone.trim()) {
      setError(
        isBs
          ? "Molimo unesite barem email adresu ili broj telefona."
          : "Please provide at least an email address or a phone number."
      );
      return;
    }

    // Dummy email submission — replace with actual API endpoint
    try {
      // await fetch("/api/contact", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ name, email, phone, message }),
      // });
      setSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      setError(isBs ? "Doslo je do greske. Pokusajte ponovo." : "An error occurred. Please try again.");
    }
  };

  return (
    <div className="rounded-2xl border border-border-subtle bg-card p-6 sm:p-8 shadow-sm">
      {submitted ? (
        <div className="text-center py-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent">
            <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-heading font-semibold text-foreground">
            {isBs ? "Hvala na poruci!" : "Thank you for your message!"}
          </h3>
          <p className="mt-2 text-sm text-foreground-muted">
            {isBs
              ? "Vas upit ce biti proslijeden na nas email. Odgovorit cemo u najkracem roku."
              : "Your inquiry has been sent to our email. We will respond as soon as possible."}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
              {isBs ? "Puno ime" : "Full Name"}
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-input-border bg-input px-4 py-2.5 text-sm text-foreground placeholder-input-placeholder focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
              placeholder={isBs ? "Vaše ime" : "Your name"}
            />
          </div>

          <div>
            <p className="text-xs text-foreground-muted mb-2">
              {isBs
                ? "Unesite email adresu ili broj telefona (dovoljno je jedno od dva)."
                : "Provide either an email address or a phone number — only one is required."}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                  {isBs ? "Email adresa" : "Email Address"}{" "}
                  <span className="text-foreground-muted font-normal">
                    ({isBs ? "opcionalno" : "optional"})
                  </span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-input-border bg-input px-4 py-2.5 text-sm text-foreground placeholder-input-placeholder focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                  placeholder={isBs ? "vas@email.com" : "you@email.com"}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
                  {isBs ? "Broj telefona" : "Phone Number"}{" "}
                  <span className="text-foreground-muted font-normal">
                    ({isBs ? "opcionalno" : "optional"})
                  </span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-input-border bg-input px-4 py-2.5 text-sm text-foreground placeholder-input-placeholder focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                  placeholder={isBs ? "+387 61 123 456" : "+1 555 123 4567"}
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
              {isBs ? "Poruka" : "Message"}
            </label>
            <textarea
              id="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full rounded-lg border border-input-border bg-input px-4 py-2.5 text-sm text-foreground placeholder-input-placeholder focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all resize-none"
              placeholder={isBs ? "Napišite svoju poruku ovdje..." : "Write your message here..."}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            {isBs ? "Pošalji Poruku" : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}
