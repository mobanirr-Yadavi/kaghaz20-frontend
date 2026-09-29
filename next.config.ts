import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Next.js compiler output out of the project root. This path is already
  // covered by the node_modules ignore rule and can be discarded at any time.
  distDir: "node_modules/.cache/next",
  // Bots that get metadata inside <head> instead of streamed later: Next's default list
  // plus Torob, whose crawler reads the product meta tags from the no-JS page.
  htmlLimitedBots:
    /[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|torob/i,
  // Old placeholder blog slugs that may already be indexed or shared.
  async redirects() {
    return [
      { source: "/blog/paper-buying-tips", destination: "/blog/a4-paper-buying-guide", permanent: true },
      { source: "/blog/print-paper-guide", destination: "/blog/a4-paper-buying-guide", permanent: true },
      { source: "/blog/printer-maintenance", destination: "/blog/printer-paper-jam-causes", permanent: true },
      { source: "/blog/office-paper", destination: "/blog/wholesale-office-paper-guide", permanent: true },
      { source: "/blog/new-warehouse", destination: "/blog", permanent: true },
      { source: "/blog/paperone-review", destination: "/blog", permanent: true },
    ];
  },
  images: {
    // Serve files directly from /public instead of generating and caching
    // optimized copies under .next/cache/images.
    unoptimized: true,
  },
};

export default nextConfig;
