export type TocItem = {
  level: 1 | 2;
  text: string;
  number: string;
  slug: string;
};

export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9가-힣-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "heading";
}

export function parseHeadings(markdown: string): TocItem[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const result: TocItem[] = [];
  let h1Index = 0;
  let h2Index = 0;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    const h2Match = line.match(/^##\s+(.+)/);
    const h1Match = !h2Match ? line.match(/^#\s+(.+)/) : null;

    if (h1Match) {
      h1Index += 1;
      h2Index = 0;
      const text = h1Match[1].trim();
      result.push({
        level: 1,
        text,
        number: `${h1Index}.`,
        slug: slugify(text),
      });
    } else if (h2Match) {
      h2Index += 1;
      const text = h2Match[1].trim();
      result.push({
        level: 2,
        text,
        number: `${h1Index}.${h2Index}.`,
        slug: slugify(text),
      });
    }
  }

  return result;
}
