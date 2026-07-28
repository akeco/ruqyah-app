"use client";

import { useEffect, useState } from "react";

type LegalDoc = "privacy" | "terms" | "disclaimer";

interface LegalLinksProps {
  lang: string;
}

const content: Record<
  "en" | "bs",
  Record<LegalDoc, { title: string; body: string[] }>
> = {
  en: {
    privacy: {
      title: "Privacy Policy",
      body: [
        "Mehlem Clinic (\"we\", \"us\") respects your privacy. This policy explains what information we collect when you use this website or book a consultation, and how we use it.",
        "Information we collect: your name, email address, and/or phone number when you submit the contact form; scheduling details when you book a session through Calendly; and the content of any messages you send us via the contact form, WhatsApp, or Telegram.",
        "How we use it: to respond to your inquiries, schedule and conduct Ruqya or psychological/emotional wellness consultations, send appointment-related communication, and improve our services. We do not sell or rent your personal information to third parties.",
        "Third-party services: we use Supabase for secure data storage, Calendly for scheduling, and YouTube for some embedded audio content. If you contact us via WhatsApp or Telegram, that conversation is also subject to those platforms' own privacy policies.",
        "Confidentiality: the content of your consultation is treated with strict confidentiality and Islamic adab (etiquette). We do not share details of your session with anyone outside our practitioners without your consent, except where required by law.",
        "Data retention: we retain your information only as long as necessary to provide our services and respond to your inquiries, after which it is deleted or anonymized.",
        "Your rights: you may request access to, correction of, or deletion of your personal data at any time by contacting us through the details on this site.",
        "Cookies: this site uses only basic functional cookies (such as remembering your language preference). We do not use third-party advertising trackers.",
        "We may update this policy from time to time. Continued use of the site after changes means you accept the revised policy.",
      ],
    },
    terms: {
      title: "Terms of Service",
      body: [
        "By using this website or booking a consultation with Mehlem Clinic, you agree to these terms.",
        "Our team: Mehlem Clinic is run by a professional, educated team specializing in Ruqya Shariah, Islamic-integrated psychological and emotional wellness counseling, and prophetic medicine. Every consultation draws on genuine expertise, dedicated study, and practical experience in these fields.",
        "Our services: online Ruqya (Quran-based healing) consultations, Islamic-integrated psychological and emotional wellness consultations, guidance on prophetic medicine and herbal remedies, and educational lectures and audio content, delivered via audio/video call or written material in English and Bosnian.",
        "Scope of practice: Ruqya and Islamic-integrated counseling are a specialized field in their own right, distinct from conventional clinical medicine and psychiatry. For conditions that require clinical medical or psychiatric diagnosis and treatment, our team will encourage and support you in also working with a licensed healthcare provider - our services are designed to complement that care. See our Disclaimer for details.",
        "Booking and scheduling: sessions are booked through our contact form or Calendly. If you need to cancel or reschedule, please let us know with as much notice as possible.",
        "Respectful use: we ask that you communicate respectfully during consultations and through our contact channels. We reserve the right to decline or discontinue service in cases of abusive or inappropriate conduct.",
        "Content and intellectual property: lectures, audio recordings, and other material on this site are the property of Mehlem Clinic and its practitioners. Downloaded audio is provided for your personal, non-commercial use only and may not be redistributed, resold, or rebroadcast without permission.",
        "Outcomes: our team approaches every session with sincerity, expertise, and diligence. Spiritual affliction and its resolution involve matters of faith, so while we are committed to providing the highest standard of care, specific outcomes cannot be guaranteed.",
        "Limitation of liability: Mehlem Clinic and its practitioners are not liable for any indirect or consequential loss arising from use of our services, to the fullest extent permitted by law.",
        "We may update these terms from time to time; continued use of our services after changes means you accept the revised terms.",
      ],
    },
    disclaimer: {
      title: "Disclaimer",
      body: [
        "Mehlem Clinic is run by a professional, educated team specializing in Ruqya Shariah, Islamic-integrated psychological and emotional wellness counseling, and prophetic medicine guidance, rooted in the Quran and authentic Sunnah. Every consultation is conducted with genuine expertise, care, and attention to your individual situation.",
        "Scope of practice: Ruqya and Islamic-integrated counseling are a specialized discipline requiring dedicated study of the Quran, Sunnah, and practical experience - distinct from, and complementary to, the clinical fields of medicine and psychiatry. Our services are not intended to diagnose physical illness, and for conditions that require clinical medical or psychiatric diagnosis and treatment, we encourage and support clients in also working with a licensed physician or mental health professional.",
        "If you are experiencing a medical or psychiatric emergency, contact your local emergency services immediately - do not rely on this site or a consultation for emergency care.",
        "Prophetic remedies (such as black seed, honey, olive oil, and hijama/cupping) are guided by practitioners trained in prophetic medicine, based on the Sunnah and a growing body of supporting research. If you are pregnant, nursing, taking medication, or managing a medical condition, we recommend also consulting your doctor before beginning any new remedy.",
        "Every case is unique: spiritual affliction, its causes, and its resolution involve matters of faith. While our team brings genuine expertise, sincerity, and diligence to every session, outcomes vary and specific results cannot be guaranteed.",
        "By using this site or booking a consultation, you acknowledge that you understand and accept this disclaimer.",
      ],
    },
  },
  bs: {
    privacy: {
      title: "Politika privatnosti",
      body: [
        "Mehlem Clinic (\"mi\") poštuje vašu privatnost. Ova politika objašnjava koje podatke prikupljamo kada koristite ovu web stranicu ili zakažete konsultaciju, te kako ih koristimo.",
        "Podaci koje prikupljamo: vaše ime, email adresu i/ili broj telefona kada popunite kontakt obrazac; podatke o terminu kada zakažete sesiju putem Calendly-ja; te sadržaj poruka koje nam pošaljete putem kontakt obrasca, WhatsAppa ili Telegrama.",
        "Kako koristimo podatke: da odgovorimo na vaše upite, zakažemo i provedemo rukja ili psihološke/emocionalne konsultacije, pošaljemo komunikaciju vezanu za termin, te unaprijedimo naše usluge. Ne prodajemo niti iznajmljujemo vaše lične podatke trećim stranama.",
        "Usluge trećih strana: koristimo Supabase za sigurno čuvanje podataka, Calendly za zakazivanje termina i YouTube za dio audio sadržaja. Ako nas kontaktirate putem WhatsAppa ili Telegrama, ta komunikacija podliježe i politikama privatnosti tih platformi.",
        "Povjerljivost: sadržaj vaše konsultacije se tretira uz strogu povjerljivost i islamski adab. Detalje vaše sesije ne dijelimo ni sa kim izvan naših praktičara bez vašeg pristanka, osim kada to zakon zahtijeva.",
        "Čuvanje podataka: vaše podatke čuvamo samo onoliko dugo koliko je potrebno da pružimo naše usluge i odgovorimo na vaše upite, nakon čega se brišu ili anonimiziraju.",
        "Vaša prava: u svakom trenutku možete zatražiti uvid, ispravku ili brisanje vaših ličnih podataka kontaktirajući nas putem podataka navedenih na ovoj stranici.",
        "Kolačići: ova stranica koristi samo osnovne funkcionalne kolačiće (npr. za pamćenje jezičke preference). Ne koristimo reklamne trackere trećih strana.",
        "Ovu politiku možemo povremeno ažurirati. Nastavak korištenja stranice nakon izmjena znači da prihvatate izmijenjenu politiku.",
      ],
    },
    terms: {
      title: "Uslovi korištenja",
      body: [
        "Korištenjem ove web stranice ili zakazivanjem konsultacije sa Mehlem Clinic, prihvatate ove uslove.",
        "Naš tim: Mehlem Clinic vodi profesionalan, obrazovan tim specijaliziran za rukju šeriju, islamsko utemeljeno psihološko i emocionalno savjetovanje, te poslaničku medicinu. Svaka konsultacija se oslanja na stvarnu stručnost, posvećeno izučavanje i praktično iskustvo u ovim oblastima.",
        "Naše usluge: online rukja (kur'ansko iscjeljenje) konsultacije, islamsko utemeljene psihološke i emocionalne konsultacije, smjernice o poslaničkoj medicini i biljnim lijekovima, te edukativna predavanja i audio sadržaj, putem audio/video poziva ili pisanog materijala na bosanskom i engleskom jeziku.",
        "Djelokrug rada: rukja i islamsko utemeljeno savjetovanje su specijalizovana oblast za sebe, odvojena od konvencionalne kliničke medicine i psihijatrije. Za stanja koja zahtijevaju kliničku medicinsku ili psihijatrijsku dijagnozu i liječenje, naš tim će vas podržati i podstaći da se obratite i licenciranom zdravstvenom radniku - naše usluge su osmišljene da dopunjuju tu njegu. Pogledajte naše Odricanje od odgovornosti za detalje.",
        "Zakazivanje termina: sesije se zakazuju putem našeg kontakt obrasca ili Calendly-ja. Ako trebate otkazati ili pomjeriti termin, molimo obavijestite nas što je prije moguće.",
        "Ispravno ponašanje: molimo vas da tokom konsultacija i komunikacije s nama komunicirate s poštovanjem. Zadržavamo pravo odbiti ili prekinuti uslugu u slučaju uvredljivog ili neprimjerenog ponašanja.",
        "Sadržaj i intelektualno vlasništvo: predavanja, audio snimci i drugi materijal na ovoj stranici su vlasništvo Mehlem Clinic i njenih praktičara. Preuzeti audio sadržaj je namijenjen isključivo za vašu ličnu, nekomercijalnu upotrebu i ne smije se dalje distribuirati, preprodavati niti reemitovati bez dozvole.",
        "Rezultati: naš tim pristupa svakoj sesiji s iskrenošću, stručnošću i posvećenošću. Duhovna smetnja i njeno razrješenje su stvar vjerovanja, pa iako smo posvećeni pružanju najvišeg standarda njege, konkretni rezultati se ne mogu garantovati.",
        "Ograničenje odgovornosti: Mehlem Clinic i njeni praktičari nisu odgovorni za bilo kakvu indirektnu ili posljedičnu štetu proisteklu iz korištenja naših usluga, u najvećoj mjeri dozvoljenoj zakonom.",
        "Ove uslove možemo povremeno ažurirati; nastavak korištenja naših usluga nakon izmjena znači da prihvatate izmijenjene uslove.",
      ],
    },
    disclaimer: {
      title: "Odricanje od odgovornosti",
      body: [
        "Mehlem Clinic vodi profesionalan, obrazovan tim specijaliziran za rukju šeriju, islamsko utemeljeno psihološko i emocionalno savjetovanje, te poslaničku medicinu, utemeljene na Kur'anu i autentičnom Sunnetu. Svaka konsultacija se provodi sa stvarnom stručnošću, pažnjom i posvećenošću vašoj individualnoj situaciji.",
        "Djelokrug rada: rukja i islamsko utemeljeno savjetovanje su specijalizovana disciplina koja zahtijeva posvećeno izučavanje Kur'ana, Sunneta i praktično iskustvo - odvojena od, ali komplementarna sa, kliničkim oblastima medicine i psihijatrije. Naše usluge nisu namijenjene za dijagnosticiranje fizičkih bolesti, a za stanja koja zahtijevaju kliničku medicinsku ili psihijatrijsku dijagnozu i liječenje, podstičemo i podržavamo klijente da se obrate i licenciranom ljekaru ili stručnjaku za mentalno zdravlje.",
        "Ako se suočavate sa medicinskom ili psihijatrijskom hitnošću, odmah kontaktirajte lokalne hitne službe - ne oslanjajte se na ovu stranicu ili konsultaciju za hitnu pomoć.",
        "Poslanički lijekovi (poput crnog kima, meda, maslinovog ulja i hidžame) se preporučuju uz vodstvo praktičara obučenih u poslaničkoj medicini, na osnovu Sunneta i rastućeg broja potpornih istraživanja. Ako ste trudni, dojite, uzimate lijekove ili imate zdravstveno stanje, preporučujemo da se prije početka bilo kojeg novog lijeka obratite i svom ljekaru.",
        "Svaki slučaj je jedinstven: duhovna smetnja, njeni uzroci i njeno razrješenje su stvar vjerovanja. Iako naš tim pristupa svakoj sesiji sa stvarnom stručnošću, iskrenošću i posvećenošću, rezultati variraju i konkretni ishodi se ne mogu garantovati.",
        "Korištenjem ove stranice ili zakazivanjem konsultacije, potvrđujete da razumijete i prihvatate ovo odricanje od odgovornosti.",
      ],
    },
  },
};

export function LegalLinks({ lang }: LegalLinksProps) {
  const isBs = lang === "bs";
  const [open, setOpen] = useState<LegalDoc | null>(null);
  const docs = content[isBs ? "bs" : "en"];

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const items: { key: LegalDoc; label: string }[] = [
    { key: "privacy", label: docs.privacy.title },
    { key: "terms", label: docs.terms.title },
    { key: "disclaimer", label: docs.disclaimer.title },
  ];

  return (
    <>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.key}>
            <button
              type="button"
              onClick={() => setOpen(item.key)}
              className="cursor-pointer text-sm text-emerald-300/60 hover:text-emerald-200 transition-colors text-left"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-dialog-title"
        >
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(null)}
            aria-hidden
          />
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl bg-card shadow-xl flex flex-col">
            <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
              <h2 id="legal-dialog-title" className="text-lg font-heading font-bold text-foreground">
                {docs[open].title}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label={isBs ? "Zatvori" : "Close"}
                className="rounded-full p-1.5 text-foreground-muted hover:bg-accent hover:text-primary transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-5 space-y-4">
              {docs[open].body.map((paragraph, i) => (
                <p key={i} className="text-sm text-foreground-muted leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
