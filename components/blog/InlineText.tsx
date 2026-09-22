import Link from "next/link";
import { Fragment } from "react";

// Renders article text, turning [anchor](href) into links. `resolve` maps an href
// from the article data to a real route (see resolveHref in lib/blog.ts).
export function InlineText({ text, resolve }: { text: string; resolve: (href: string) => string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) return <Fragment key={index}>{part}</Fragment>;
    return (
      <Link className="article-link" href={resolve(match[2])} key={index}>
        {match[1]}
      </Link>
    );
  });
}
