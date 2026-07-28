import Link from "next/link";

interface LectureCardProps {
  lecture: any;
  lang: string;
}

const PREVIEW_LIMIT = 140;

function getPreviewText(raw: string | null | undefined, limit = PREVIEW_LIMIT) {
  if (!raw) return "";

  const plain = raw
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^-\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length <= limit) return plain;
  return `${plain.slice(0, limit).trimEnd()}...`;
}

export function LectureCard({ lecture, lang }: LectureCardProps) {
  const isBs = lang === "bs";
  const title = isBs ? lecture.title_bs : lecture.title_en;
  const excerpt = isBs ? lecture.excerpt_bs : lecture.excerpt_en;
  const content = isBs ? lecture.content_bs : lecture.content_en;
  const preview = getPreviewText(excerpt || content);
  const author = isBs ? lecture.author_bs : lecture.author_en;
  const category = isBs ? lecture.category_bs : lecture.category_en;
  const slug = lecture.slug;
  const imageUrl = lecture.image_url || "/images/lecture-placeholder.webp";
  const date = lecture.created_at
    ? new Date(lecture.created_at).toLocaleDateString(isBs ? "bs-BA" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  const categoryColors: Record<string, string> = {
    ruqya: "bg-accent text-primary",
    aqidah: "bg-secondary/20 text-secondary",
    "mental-health": "bg-blue-100 text-blue-800",
    family: "bg-purple-100 text-purple-800",
    general: "bg-background-elevated text-foreground-muted",
  };

  const colorClass = categoryColors[category?.toLowerCase()] || "bg-background-elevated text-foreground-muted";

  return (
    <Link
      href={`/${lang}/lectures/${slug}`}
      className="group flex flex-col rounded-xl border border-border-subtle bg-card overflow-hidden hover:border-secondary/50 hover:shadow-md transition-all"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-background-elevated">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="block h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col flex-1 p-6">
        {/* Category badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colorClass}`}>
            {category}
          </span>
          <span className="text-xs text-foreground-muted">{date}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-heading font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-3">
          {title}
        </h3>

        {/* Preview text + Read more */}
        <p className="text-sm text-foreground-muted leading-relaxed mb-4 flex-1">
          {preview}{" "}
          <span className="whitespace-nowrap font-semibold text-primary group-hover:text-primary/80 transition-colors">
            {isBs ? "Čitaj više" : "Read more"}
          </span>
        </p>

        {/* Author */}
        {author && (
          <div className="flex items-center gap-2 pt-4 border-t border-border-subtle">
            <div className="h-7 w-7 rounded-full bg-accent flex items-center justify-center">
              <span className="text-xs font-bold text-primary">
                {author.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-xs font-medium text-foreground-muted">{author}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
