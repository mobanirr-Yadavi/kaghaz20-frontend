"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Fired by Chrome/Edge/Android when the site is installable (not in lib.dom types).
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

declare global {
  interface Window {
    // Captured by the early script in app/layout.tsx, which can run before React hydrates.
    __kaghazInstallPrompt?: BeforeInstallPromptEvent;
  }
}

const DISMISS_KEY = "kaghaz20-install-dismissed";
const DISMISS_MS = 7 * 24 * 60 * 60 * 1000;

function recentlyDismissed() {
  try {
    const at = Number(window.localStorage.getItem(DISMISS_KEY));
    return at > 0 && Date.now() - at < DISMISS_MS;
  } catch {
    return false;
  }
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

// iPhone/iPad have no install event; users add the site from Safari's Share menu.
function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
}

function ShareIcon() {
  return (
    <svg className="install-prompt-share" viewBox="0 0 24 24" fill="none" aria-label="اشتراک‌گذاری" role="img">
      <path d="M12 3v12M8 7l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function InstallPrompt() {
  const pathname = usePathname();
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    if (isStandalone() || recentlyDismissed()) return;

    const pick = () => {
      if (window.__kaghazInstallPrompt) setInstallEvent(window.__kaghazInstallPrompt);
    };
    const onInstalled = () => {
      window.__kaghazInstallPrompt = undefined;
      setInstallEvent(null);
      setShowIosHint(false);
    };

    pick();
    window.addEventListener("kaghaz-install-available", pick);
    window.addEventListener("appinstalled", onInstalled);
    const iosTimer = isIos() ? window.setTimeout(() => setShowIosHint(true), 3000) : undefined;

    return () => {
      window.removeEventListener("kaghaz-install-available", pick);
      window.removeEventListener("appinstalled", onInstalled);
      window.clearTimeout(iosTimer);
    };
  }, []);

  const dismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // Storage may be blocked; the popup just shows again next visit.
    }
    setInstallEvent(null);
    setShowIosHint(false);
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    // The event can only be used once.
    window.__kaghazInstallPrompt = undefined;
    setInstallEvent(null);
    if (outcome === "dismissed") dismiss();
  };

  if (!installEvent && !showIosHint) return null;

  // The mobile bottom nav is hidden on the auth pages.
  const aboveNav = pathname !== "/login" && pathname !== "/register";

  return (
    <aside className={`install-prompt ${aboveNav ? "install-prompt--above-nav" : ""}`} aria-label="نصب اپلیکیشن کاغذ ۲۰">
      <Image src="/icons/icon-96x96.png" alt="" width={48} height={48} className="install-prompt-icon" />
      <div className="install-prompt-text">
        <b>نصب اپلیکیشن کاغذ ۲۰</b>
        {installEvent ? (
          <small>دسترسی سریع‌تر به فروشگاه از صفحه اصلی گوشی یا کامپیوتر</small>
        ) : (
          <small>
            در سافاری روی دکمه اشتراک‌گذاری <ShareIcon /> بزنید و «Add to Home Screen» را انتخاب کنید.
          </small>
        )}
      </div>
      <div className="install-prompt-actions">
        {installEvent ? (
          <button type="button" className="install-prompt-primary" onClick={install}>
            نصب
          </button>
        ) : null}
        <button type="button" className="install-prompt-close" onClick={dismiss}>
          {installEvent ? "بعداً" : "متوجه شدم"}
        </button>
      </div>
    </aside>
  );
}
