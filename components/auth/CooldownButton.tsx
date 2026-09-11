import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

type CooldownButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  // 0 → 1 while waiting (fills with the button's color); null when the button is ready.
  progress: number | null;
  children: ReactNode;
};

// A button that fills with its color as a cooldown runs out. The label is drawn twice:
// dark on the empty track and light on the fill, which is revealed with clip-path, so
// the text stays readable wherever the fill edge is.
export function CooldownButton({ progress, className = "", children, style, ...props }: CooldownButtonProps) {
  const cooling = progress !== null;
  const progressStyle = cooling ? ({ "--cooldown-progress": Math.min(1, Math.max(0, progress)) } as CSSProperties) : undefined;

  return (
    <button {...props} className={`cooldown-button ${cooling ? "is-cooling" : ""} ${className}`} style={{ ...style, ...progressStyle }}>
      <span className="cooldown-label">{children}</span>
      {cooling ? (
        <span className="cooldown-fill" aria-hidden="true">
          {children}
        </span>
      ) : null}
    </button>
  );
}
