type SectionTitleProps = {
  title: string;
  subtitle?: string;
  align?: "center" | "right";
};

export function SectionTitle({ title, subtitle, align = "center" }: SectionTitleProps) {
  return (
    <div className={align === "center" ? "text-center" : "text-right"}>
      <h2 className="text-2xl font-black text-textNavy">{title}</h2>
      <span className={`mt-3 block h-0.5 w-8 rounded-full bg-buttonGold ${align === "center" ? "mx-auto" : ""}`} />
      {subtitle ? <p className="mt-3 text-sm font-semibold leading-7 text-muted">{subtitle}</p> : null}
    </div>
  );
}
