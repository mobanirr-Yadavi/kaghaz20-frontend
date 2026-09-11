"use client";

import Link from "next/link";
import { useState } from "react";
import type { VisitDay, VisitStats } from "@/lib/visits";
import { EmptyRows, money as num } from "./DashboardParts";

const pageNames: Record<string, string> = {
  "/": "صفحه اصلی",
  "/shop": "فروشگاه",
  "/store": "فروشگاه",
  "/cart": "سبد خرید",
  "/about": "درباره ما",
  "/contact": "تماس با ما",
  "/blog": "مجله",
  "/faq": "سوالات متداول",
  "/login": "ورود",
  "/register": "ثبت‌نام",
  "/terms": "شرایط و قوانین",
  "/privacy": "حریم خصوصی",
  "/order-tracking": "پیگیری سفارش",
  "/payment-methods": "رویه‌های پرداخت",
  "/payment/result": "نتیجه پرداخت",
};

const shortDay = new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "short", timeZone: "Asia/Tehran" });
const longDay = new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Tehran" });
// Day keys are Iran-time calendar days ("2026-09-11"); noon Tehran time is safely inside that day.
const toDate = (key: string) => new Date(`${key}T12:00:00+03:30`);

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function pageLabel(path: string, productNames: Record<string, string>) {
  if (pageNames[path]) return pageNames[path];
  if (path.startsWith("/products/")) return productNames[safeDecode(path.slice("/products/".length))] ?? "صفحه محصول";
  if (path.startsWith("/blog/")) return "مقاله مجله";
  return safeDecode(path);
}

// Round the axis top up to 1 / 2 / 5 × 10^n so ticks stay clean numbers.
function niceCeil(value: number) {
  if (value <= 0) return 1;
  const power = 10 ** Math.floor(Math.log10(value));
  return ([1, 2, 5, 10].find((step) => step * power >= value) ?? 10) * power;
}

function Tooltip({ day, index, count }: { day: VisitDay; index: number; count: number }) {
  // Columns run right-to-left (oldest at the right); keep the tooltip inside the plot at both edges.
  const style =
    index < 3
      ? { right: 0 }
      : index > count - 4
        ? { left: 0 }
        : { right: `${((index + 0.5) / count) * 100}%`, transform: "translateX(50%)" };

  return (
    <div className="visits-tooltip" style={style} aria-hidden="true">
      <b>{num(day.views)} بازدید</b>
      <small>{num(day.visitors)} بازدیدکننده</small>
      <small>{longDay.format(toDate(day.date))}</small>
    </div>
  );
}

function DailyChart({ days }: { days: VisitDay[] }) {
  const [active, setActive] = useState<number | null>(null);
  const max = niceCeil(Math.max(0, ...days.map((day) => day.views)));
  const ticks = max % 2 === 0 ? [max, max / 2, 0] : [max, 0];
  const peak = days.reduce((best, day, index) => (day.views > days[best].views ? index : best), 0);
  const columns = { gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` };

  return (
    <div className="visits-chart" role="group" aria-label="نمودار بازدید روزانه در ۳۰ روز اخیر">
      <div className="visits-y" aria-hidden="true">
        {ticks.map((tick) => <span key={tick}>{num(tick)}</span>)}
      </div>
      <div className="visits-plot-wrap">
        <div className="visits-plot">
          {ticks.filter((tick) => tick > 0).map((tick) => (
            <span key={tick} className="visits-gridline" style={{ bottom: `${(tick / max) * 100}%` }} aria-hidden="true" />
          ))}
          <div className="visits-bars" style={columns}>
            {days.map((day, index) => {
              const share = (day.views / max) * 100;
              return (
                <button
                  key={day.date}
                  type="button"
                  className="visits-col"
                  aria-label={`${longDay.format(toDate(day.date))}: ${num(day.views)} بازدید، ${num(day.visitors)} بازدیدکننده`}
                  onPointerEnter={() => setActive(index)}
                  onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive(index)}
                  onBlur={() => setActive(null)}
                >
                  <span className="visits-bar" style={{ height: day.views ? `max(2px, ${share}%)` : 0 }} />
                  {index === peak && day.views > 0 ? (
                    <span className="visits-cap" style={{ bottom: `calc(${share}% + 4px)` }}>{num(day.views)}</span>
                  ) : null}
                </button>
              );
            })}
          </div>
          {active !== null ? <Tooltip day={days[active]} index={active} count={days.length} /> : null}
        </div>
        <div className="visits-x" style={columns} aria-hidden="true">
          {days.map((day, index) => (
            <span key={day.date}>{(days.length - 1 - index) % 7 === 0 ? shortDay.format(toDate(day.date)) : ""}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TopPages({ pages, productNames }: { pages: VisitStats["topPages"]; productNames: Record<string, string> }) {
  if (!pages.length) return <EmptyRows text="هنوز بازدیدی ثبت نشده است." />;
  const max = pages[0].views;

  return (
    <div className="table-wrap">
      <table className="visits-pages">
        <thead>
          <tr><th>صفحه</th><th>بازدید</th></tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page.path}>
              <td>
                <div className="visits-page">
                  <b>{pageLabel(page.path, productNames)}</b>
                  <small dir="ltr">{safeDecode(page.path)}</small>
                </div>
              </td>
              <td>
                <div className="visits-share">
                  <span>{num(page.views)}</span>
                  <span className="visits-share-track" aria-hidden="true">
                    <i style={{ width: `${(page.views / max) * 100}%` }} />
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function VisitStatsPanel({
  stats,
  detailed = false,
  productNames = {},
}: {
  stats: VisitStats;
  detailed?: boolean;
  productNames?: Record<string, string>;
}) {
  const { today, yesterday, last30, online, daily, topPages, since } = stats;
  const diff = today.views - yesterday.views;
  const delta = diff === 0 ? "برابر با دیروز" : `${diff > 0 ? "▲" : "▼"} ${num(Math.abs(diff))} نسبت به دیروز`;

  return (
    <section className="visits-panel" aria-label="آمار بازدید سایت">
      {!detailed ? (
        <div className="visits-head">
          <h2>بازدید سایت</h2>
          <Link href="/account/visits">جزئیات بازدید</Link>
        </div>
      ) : null}

      <div className="metric-grid admin-metrics">
        <article><i>◉</i><span>بازدید امروز<b>{num(today.views)}</b><small>{delta}</small></span></article>
        <article><i>♙</i><span>بازدیدکننده امروز<b>{num(today.visitors)}</b><small>نفر</small></span></article>
        <article><i className="visits-online">●</i><span>آنلاین<b>{num(online)}</b><small>در ۲ دقیقه اخیر</small></span></article>
        <article><i>▥</i><span>بازدید ۳۰ روز اخیر<b>{num(last30.views)}</b><small>{num(last30.visitors)} بازدیدکننده</small></span></article>
      </div>

      {detailed ? (
        <div className="visits-layout">
          <section className="dash-card">
            <div className="card-title"><h2>بازدید روزانه</h2><span>۳۰ روز اخیر</span></div>
            {stats.total > 0 ? (
              <>
                <DailyChart days={daily} />
                <details className="visits-table">
                  <summary>نمایش جدول</summary>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>تاریخ</th><th>بازدید</th><th>بازدیدکننده</th></tr></thead>
                      <tbody>
                        {[...daily].reverse().map((day) => (
                          <tr key={day.date}><td>{longDay.format(toDate(day.date))}</td><td>{num(day.views)}</td><td>{num(day.visitors)}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              </>
            ) : (
              <EmptyRows text="هنوز بازدیدی ثبت نشده است؛ آمار از اولین بازدید بعد از انتشار جمع می‌شود." />
            )}
            {since ? <p className="visits-since">آمار از {longDay.format(toDate(since))} ثبت می‌شود.</p> : null}
          </section>

          <section className="dash-card">
            <div className="card-title"><h2>پربازدیدترین صفحه‌ها</h2><span>۳۰ روز اخیر</span></div>
            <TopPages pages={topPages} productNames={productNames} />
          </section>
        </div>
      ) : null}
    </section>
  );
}
