import { ScrollReveal } from "@/components/ScrollReveal";

interface FAQSectionProps {
  lang: string;
}

const data = {
  en: [
    {
      q: "What is Ruqya?",
      a: "Ruqya (also spelled Ruqyah) is an Islamic practice of spiritual healing that uses verses from the Quran and authentic supplications of the Prophet Muhammad ﷺ to seek protection from and treatment for spiritual ailments such as the evil eye (al-'ayn), black magic (sihr), and jinn possession.",
    },
    {
      q: "Is Ruqya a substitute for medical or psychological treatment?",
      a: "No. Ruqya is a complementary spiritual practice rooted in the Sunnah. It should be used alongside - never as a replacement for - professional medical or psychological care. Always consult a licensed healthcare provider for physical or mental health concerns.",
    },
    {
      q: "How does an online audio or video Ruqya consultation work?",
      a: "You book a private session at a convenient time, describe your concern to a practitioner in a confidential setting, and receive live Quranic recitation, personalized supplications, and practical guidance over an audio or video call, followed by a plan for daily practice.",
    },
    {
      q: "What are common signs associated with the evil eye or black magic?",
      a: "Practitioners and traditional sources commonly associate persistent unexplained fatigue, sudden changes in behavior or mood, recurring nightmares, or unexplained difficulties in health, marriage, or finances with spiritual affliction. These signs are not a medical diagnosis, and physical symptoms should always be evaluated by a qualified doctor first.",
    },
    {
      q: "Can Ruqya be performed on oneself at home?",
      a: "Yes. Self-Ruqya - reciting Surah Al-Fatiha, Ayat al-Kursi, and the last three surahs of the Quran (Al-Ikhlas, Al-Falaq, An-Nas) over oneself or one's home and water - is encouraged in the Sunnah and can be practiced daily alongside guided sessions.",
    },
    {
      q: "Which Quranic verses are commonly recited during Ruqya?",
      a: "Common recitations include Surah Al-Fatiha, Ayat al-Kursi (2:255), the closing verses of Surah Al-Baqarah, and the Mu'awwidhatayn - Surah Al-Falaq and Surah An-Nas - alongside authentic prophetic supplications for protection and healing.",
    },
    {
      q: "Are prophetic remedies like black seed, honey, and cupping scientifically proven?",
      a: "Black seed, honey, olive oil, and hijama (cupping) are widely used in traditional and prophetic medicine and are supported by a growing body of preliminary research. They are not a substitute for medical advice - consult a qualified healthcare provider before using them to treat a medical condition.",
    },
    {
      q: "How long does it take to see results from Ruqya?",
      a: "There is no fixed timeframe. Some people notice relief after a single session, while others require consistent recitation and dua over weeks or months. Patience, sincerity, and regular practice are considered essential in the Sunnah tradition.",
    },
  ],
  bs: [
    {
      q: "Šta je Ruqya?",
      a: "Ruqya je islamska praksa duhovnog iscjeljenja koja koristi ajete iz Kur'ana i autentične dove Poslanika Muhammeda ﷺ radi zaštite i liječenja duhovnih smetnji poput uroka (al-ajna), sihra (crne magije) i opsjednutosti džinima.",
    },
    {
      q: "Da li je Rukja zamjena za medicinsko ili psihološko liječenje?",
      a: "Ne. Rukja je komplementarna duhovna praksa utemeljena na Sunnetu. Treba se koristiti uz - nikako umjesto - profesionalnu medicinsku ili psihološku njegu. Za fizičke ili mentalne zdravstvene probleme uvijek se obratite licenciranom zdravstvenom radniku.",
    },
    {
      q: "Kako funkcioniše online audio ili video rukja konsultacija?",
      a: "Zakažete privatni termin koji vam odgovara, opišete svoju brigu praktičaru u povjerljivom okruženju i primite direktnu kur'ansku recitaciju, personalizirane dove i praktične savjete putem audio ili video poziva, nakon čega slijedi plan za svakodnevnu praksu.",
    },
    {
      q: "Koji su uobičajeni znakovi uroka ili sihra?",
      a: "Praktičari i tradicionalni izvori obično povezuju upornu neobjašnjivu iscrpljenost, iznenadne promjene u ponašanju ili raspoloženju, ponavljajuće noćne more ili neobjašnjive poteškoće u zdravlju, braku ili finansijama sa duhovnom smetnjom. Ovi znakovi nisu medicinska dijagnoza - fizičke simptome uvijek prvo treba procijeniti kvalifikovani ljekar.",
    },
    {
      q: "Može li se rukja izvoditi samostalno kod kuće?",
      a: "Da. Samo-rukja - učenje sure El-Fatiha, Ajetu-l-kursija i posljednje tri sure Kur'ana (El-Ihlas, El-Felak, En-Nas) nad sobom ili svojim domom i vodom - preporučuje se u Sunnetu i može se prakticirati svakodnevno uz vođene sesije.",
    },
    {
      q: "Koji se ajeti Kur'ana najčešće uče prilikom rukje?",
      a: "Uobičajene recitacije uključuju suru El-Fatiha, Ajetu-l-kursij (2:255), završne ajete sure El-Bekare i Mu'avvizetejn - sure El-Felak i En-Nas - zajedno s autentičnim poslaničkim dovama za zaštitu i iscjeljenje.",
    },
    {
      q: "Jesu li poslanički lijekovi poput crnog kima, meda i hidžame naučno dokazani?",
      a: "Crni kim, med, maslinovo ulje i hidžama (kupiranje) se široko koriste u tradicionalnoj i poslaničkoj medicini i podržani su rastućim brojem preliminarnih istraživanja. Nisu zamjena za medicinski savjet - prije upotrebe za liječenje zdravstvenog stanja obratite se kvalifikovanom zdravstvenom radniku.",
    },
    {
      q: "Koliko dugo treba da se vide rezultati rukje?",
      a: "Ne postoji fiksni vremenski okvir. Neki ljudi primijete olakšanje nakon jedne sesije, dok drugima treba dosljedna recitacija i dova tokom sedmica ili mjeseci. Strpljenje, iskrenost i redovna praksa smatraju se ključnim u sunnetskoj tradiciji.",
    },
  ],
};

export function FAQSection({ lang }: FAQSectionProps) {
  const isBs = lang === "bs";
  const items = data[isBs ? "bs" : "en"];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto space-y-3">
        {items.map((item, i) => (
          <ScrollReveal key={i} delay={i * 60}>
            <details className="group rounded-xl border border-border-subtle bg-card px-6 py-4 open:shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading font-semibold text-foreground">
                {item.q}
                <svg
                  className="h-5 w-5 flex-shrink-0 text-secondary transition-transform group-open:rotate-45"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <p className="mt-3 text-sm text-foreground-muted leading-relaxed">{item.a}</p>
            </details>
          </ScrollReveal>
        ))}
      </div>
    </>
  );
}
