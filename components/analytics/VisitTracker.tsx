"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const HEARTBEAT_MS = 60_000;

function send(path: string, type: "view" | "ping") {
  // keepalive lets the request finish even when the user is leaving the page.
  fetch("/api/visits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, type }),
    keepalive: true,
  }).catch(() => {});
}

// Counts a page view on every route change and pings while the tab is visible,
// so the admin panel can show today's visits and who is online (lib/visits.ts).
export function VisitTracker() {
  const pathname = usePathname();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    // The ref also stops React's dev-only double effect run from counting twice.
    if (!pathname || lastSent.current === pathname) return;
    lastSent.current = pathname;
    send(pathname, "view");
  }, [pathname]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") send(window.location.pathname, "ping");
    }, HEARTBEAT_MS);
    return () => window.clearInterval(timer);
  }, []);

  return null;
}
