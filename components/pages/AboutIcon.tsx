import type { ReactNode } from "react";

// Line icons for the about page; they inherit size and colour from the parent.
const paths: Record<string, ReactNode> = {
  coins: (
    <>
      <ellipse cx="12" cy="6.5" rx="7" ry="3" />
      <path d="M5 6.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
      <path d="M5 11.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 1.9-1.4L21 8H6.2" />
      <circle cx="10" cy="19" r="1.4" />
      <circle cx="17" cy="19" r="1.4" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6h10v10H3z" />
      <path d="M13 9.5h4l4 3.5V16h-8z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17.5" cy="18" r="1.6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5.5c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  doc: (
    <>
      <path d="M7 3h7l5 5v13H7z" />
      <path d="M14 3v5h5" />
      <path d="M10 13h7M10 17h5" />
    </>
  ),
  box: (
    <>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </>
  ),
  headset: (
    <>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <path d="M4 13h3v6H5.5A1.5 1.5 0 0 1 4 17.5zM20 13h-3v6h1.5a1.5 1.5 0 0 0 1.5-1.5z" />
      <path d="M17 19a4 4 0 0 1-4 2h-1" />
    </>
  ),
  diamond: (
    <>
      <path d="M7 3h10l4 5-9 13L3 8z" />
      <path d="M3 8h18M9 3 7 8l5 13 5-13-2-5" />
    </>
  ),
  code: (
    <>
      <path d="m9 8-4 4 4 4M15 8l4 4-4 4" />
      <path d="M13 5 11 19" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.8M17 15a5 5 0 0 1 3.5 5" />
    </>
  ),
  growth: (
    <>
      <path d="M4 20h16" />
      <path d="m5 15 4-4 3 3 6-7" />
      <path d="M14 7h4v4" />
    </>
  ),
  check: <path d="m5 12 4 4 10-10" />,
};

export type AboutIconName = keyof typeof paths;

export function AboutIcon({ name, className = "" }: { name: AboutIconName; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
