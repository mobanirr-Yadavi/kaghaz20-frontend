// Product descriptions are HTML from the admin rich-text editor; older ones are plain text.
export const hasHtml = (value: string) => /<[a-z][\s\S]*>/i.test(value);

// Plain-text version for summaries and meta descriptions (React escapes it on render).
export function richTextToPlain(value: string): string {
  if (!hasHtml(value)) return value.replace(/\s+/g, " ").trim();

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
