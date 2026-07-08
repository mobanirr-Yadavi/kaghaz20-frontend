"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LOADER_DURATION = 1500;

export function PageTransitionLoader() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const showLoader = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsVisible(true);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, LOADER_DURATION);
  };

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const link = (event.target as HTMLElement | null)?.closest("a[href]");

      if (!link) {
        return;
      }

      const href = link.getAttribute("href");
      const target = link.getAttribute("target");

      if (!href || href.startsWith("#") || target === "_blank") {
        return;
      }

      const nextUrl = new URL(href, window.location.href);

      if (nextUrl.origin !== window.location.origin || nextUrl.pathname === window.location.pathname) {
        return;
      }

      showLoader();
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    showLoader();
  }, [pathname]);

  return (
    <div className={`page-transition-loader${isVisible ? " is-visible" : ""}`} aria-hidden={!isVisible} role="status">
      <div className="page-transition-loader__card">
        <Image
          alt="کاغذ ۲۰"
          className="page-transition-loader__logo"
          height={72}
          priority
          src="/images/logo-kaghaz20.png"
          width={150}
        />
        <span>در حال بارگذاری...</span>
      </div>
    </div>
  );
}
