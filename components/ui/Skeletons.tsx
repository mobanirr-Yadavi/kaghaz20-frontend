// Placeholder shapes shown while a page's data loads (see the loading.tsx files).
const pulse = "animate-pulse rounded-2xl bg-[linear-gradient(110deg,#eef3fb_8%,#f7f9fd_18%,#eef3fb_33%)]";

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-borderBlue/60 bg-white p-2.5 shadow-soft">
      <div className={`aspect-square sm:aspect-[5/4] ${pulse}`} />
      <div className="space-y-3 p-2 pt-4">
        <div className={`h-3 w-1/3 ${pulse}`} />
        <div className={`h-4 w-4/5 ${pulse}`} />
        <div className={`h-5 w-1/2 ${pulse}`} />
        <div className={`h-11 w-full ${pulse}`} />
      </div>
    </div>
  );
}

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`${pulse} ${className}`} />;
}
