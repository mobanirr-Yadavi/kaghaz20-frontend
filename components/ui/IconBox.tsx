import type { PropsWithChildren } from "react";

type IconBoxProps = PropsWithChildren<{
  title: string;
  text?: string;
}>;

export function IconBox({ title, text, children }: IconBoxProps) {
  return (
    <div className="rounded-lg bg-white p-5 text-center shadow-card">
      <div className="mx-auto mb-3 grid size-14 place-items-center rounded-full bg-[#FFF7E7] text-2xl text-buttonGold">{children}</div>
      <h3 className="font-black text-textNavy">{title}</h3>
      {text ? <p className="mt-2 text-xs font-semibold leading-6 text-muted">{text}</p> : null}
    </div>
  );
}
