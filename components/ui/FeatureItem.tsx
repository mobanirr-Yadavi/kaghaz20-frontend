type FeatureItemProps = {
  icon: string;
  title: string;
  subtitle: string;
};

export function FeatureItem({ icon, title, subtitle }: FeatureItemProps) {
  return (
    <div className="flex min-w-0 items-center justify-center gap-2 border-l border-borderBlue/70 last:border-l-0 sm:flex-col sm:gap-1">
      <span className="text-xl text-buttonGold">{icon}</span>
      <div className="text-center leading-tight">
        <p className="text-xs font-bold text-textNavy">{title}</p>
        <p className="mt-1 text-[11px] font-semibold text-muted">{subtitle}</p>
      </div>
    </div>
  );
}
