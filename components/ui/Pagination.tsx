"use client";

const fa = new Intl.NumberFormat("fa-IR");

// 1 … 4 5 6 … 12 — always the first, last and the neighbours of the current page.
function pageItems(page: number, totalPages: number): (number | "gap")[] {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages].filter((value) => value >= 1 && value <= totalPages).sort((a, b) => a - b);
  const items: (number | "gap")[] = [];
  sorted.forEach((value, index) => {
    const previous = sorted[index - 1];
    if (previous && value - previous === 2) items.push(previous + 1);
    else if (previous && value - previous > 2) items.push("gap");
    items.push(value);
  });
  return items;
}

const baseButton =
  "inline-flex h-10 min-w-10 items-center justify-center whitespace-nowrap rounded-full border px-3 text-sm font-black shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal";
const idleButton = "border-borderBlue bg-white text-navy hover:border-royal hover:bg-softBlue";
const disabledButton = "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-borderBlue disabled:hover:bg-white";

export function Pagination({
  page,
  totalPages,
  onChange,
  disabled = false,
  className = "",
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
}) {
  if (totalPages < 1) return null;
  const go = (target: number) => {
    if (!disabled && target !== page && target >= 1 && target <= totalPages) onChange(target);
  };

  return (
    <nav aria-label="صفحه‌بندی" className={`flex flex-wrap items-center justify-center gap-2 ${className}`}>
      <button
        type="button"
        className={`${baseButton} ${idleButton} ${disabledButton} gap-1`}
        disabled={disabled || page <= 1}
        onClick={() => go(page - 1)}
      >
        <span aria-hidden>›</span> قبلی
      </button>

      <ul className="flex items-center gap-1.5">
        {pageItems(page, totalPages).map((item, index) =>
          item === "gap" ? (
            <li aria-hidden className="px-1 text-sm font-black text-muted" key={`gap-${index}`}>
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                aria-current={item === page ? "page" : undefined}
                aria-label={`صفحه ${fa.format(item)}`}
                className={`${baseButton} ${item === page ? "border-navy bg-navy text-white" : `${idleButton} ${disabledButton}`}`}
                disabled={disabled && item !== page}
                onClick={() => go(item)}
              >
                {fa.format(item)}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        className={`${baseButton} ${idleButton} ${disabledButton} gap-1`}
        disabled={disabled || page >= totalPages}
        onClick={() => go(page + 1)}
      >
        بعدی <span aria-hidden>‹</span>
      </button>
    </nav>
  );
}
