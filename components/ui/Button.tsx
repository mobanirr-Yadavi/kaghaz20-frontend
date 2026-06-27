import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "gold" | "navy";
  }
>;

export function Button({ children, className = "", variant = "gold", ...props }: ButtonProps) {
  const variants = {
    gold: "bg-buttonGold text-white hover:bg-[#d99b27]",
    navy: "bg-navy text-white hover:bg-deepNavy",
  };

  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-6 text-sm font-bold shadow-soft transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
