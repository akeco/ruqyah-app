export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function lectureSlugId(title: string, id: string): string {
  const base = slugify(title);
  return base ? `${base}-${id}` : id;
}

export function extractLectureId(slugId: string): string {
  const idx = slugId.lastIndexOf("-");
  if (idx === -1) return slugId;
  return slugId.slice(idx + 1);
}
