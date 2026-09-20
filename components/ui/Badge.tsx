import type { PropsWithChildren } from "react";

export function Badge({ children }: PropsWithChildren) {
  return <span className="rounded-md bg-buttonGold px-3 py-1 text-xs font-black text-white">{children}</span>;
}
