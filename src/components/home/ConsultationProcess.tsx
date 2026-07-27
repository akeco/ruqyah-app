import { ScrollReveal } from "@/components/ScrollReveal";

interface ConsultationProcessProps {
  lang: string;
}

const data = {
  en: [
    {
      step: "01",
      title: "Book Your Session",
      description:
        "Choose a convenient time for a private audio or video Ruqya consultation, wherever you are in the world.",
    },
    {
      step: "02",
      title: "Share Your Concern",
      description:
        "Describe your symptoms, spiritual concerns, or the ailment you are experiencing in a confidential, judgment-free setting.",
    },
    {
      step: "03",
      title: "Guided Ruqya & Recitation",
      description:
        "Receive live Quranic recitation, personalized supplications, and practical guidance from a qualified practitioner during your call.",
    },
    {
      step: "04",
      title: "Follow-Up & Support",
      description:
        "Get a personalized plan for daily adhkar, recommended prophetic remedies, and follow-up sessions as needed.",
    },
  ],
  bs: [
    {
      step: "01",
      title: "Zakažite termin",
      description:
        "Odaberite termin koji vam odgovara za privatnu audio ili video rukja konsultaciju, gdje god se nalazili u svijetu.",
    },
    {
      step: "02",
      title: "Opišite svoju brigu",
      description:
        "Opišite simptome, duhovne brige ili tegobu koju osjećate u povjerljivom okruženju bez osuđivanja.",
    },
    {
      step: "03",
      title: "Vođena rukja i recitacija",
      description:
        "Primite direktnu kur'ansku recitaciju, personalizirane dove i praktične savjete od kvalifikovanog praktičara tokom poziva.",
    },
    {
      step: "04",
      title: "Praćenje i podrška",
      description:
        "Dobijte personalizirani plan za svakodnevni zikr, preporučene poslaničke lijekove i sesije praćenja po potrebi.",
    },
  ],
};

export function ConsultationProcess({ lang }: ConsultationProcessProps) {
  const isBs = lang === "bs";
  const steps = data[isBs ? "bs" : "en"];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {steps.map((item, i) => (
        <ScrollReveal key={item.step} delay={i * 80}>
          <div className="relative rounded-xl border border-border-subtle bg-card p-6">
            <span className="text-4xl font-heading font-bold text-accent">{item.step}</span>
            <h3 className="mt-3 text-lg font-heading font-bold text-foreground mb-2">{item.title}</h3>
            <p className="text-sm text-foreground-muted leading-relaxed">{item.description}</p>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
