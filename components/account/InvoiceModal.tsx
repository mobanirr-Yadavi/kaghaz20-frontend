"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Printer, X } from "lucide-react";
import type { Order } from "@/lib/account";
import { SITE_URL, SUPPORT_PHONE } from "@/lib/site";

const SELLER = {
  name: "کاغذ ۲۰",
  address: "تهران، بلوار میرداماد، خیابان کازرون شمالی، خیابان نیک‌رای، پلاک ۲، طبقه سوم، واحد ۶",
  phone: SUPPORT_PHONE.display,
  email: "info@kaghaz20.ir",
  site: SITE_URL.replace(/^https?:\/\//, ""),
};

const statusLabels: Record<string, string> = {
  Paid: "پرداخت‌شده",
  Pending: "در انتظار پرداخت",
  Processing: "در حال پردازش",
  Shipped: "ارسال‌شده",
  Delivered: "تحویل‌شده",
  Cancelled: "لغوشده",
};
// Orders that have been paid for get a sales invoice; the rest a pro-forma.
const PAID_STATUSES = new Set(["paid", "processing", "shipped", "delivered"]);

const fa = new Intl.NumberFormat("fa-IR");
const toman = (value: number) => `${fa.format(Math.round(value || 0))} تومان`;
const dateTime = (value: string) =>
  value
    ? new Intl.DateTimeFormat("fa-IR", { dateStyle: "long", timeStyle: "short" }).format(new Date(value))
    : "—";

// Button for an order row; stops the click so it does not also toggle the row.
export function InvoiceButton({ onClick, compact = false }: { onClick: () => void; compact?: boolean }) {
  return (
    <button
      className="invoice-button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      title="مشاهده و چاپ فاکتور"
      type="button"
    >
      <Printer aria-hidden />
      <span className={compact ? "sr-only" : undefined}>مشاهده فاکتور</span>
    </button>
  );
}

export function InvoiceModal({ order, onClose }: { order: Order | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Lock page scroll, focus the close button, close on Escape, restore focus afterwards.
  useEffect(() => {
    if (!order) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open", "invoice-open");
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("modal-open", "invoice-open");
      previousFocus?.focus();
    };
  }, [order]);

  if (!order) return null;

  const items = order.items ?? [];
  const lineTotal = (item: Order["items"][number]) => item.totalPrice ?? (item.unitPrice ?? 0) * item.quantity;
  const itemsTotal = items.reduce((sum, item) => sum + lineTotal(item), 0);
  const paid = PAID_STATUSES.has(order.status.toLowerCase());
  const title = paid ? "فاکتور فروش" : "پیش‌فاکتور";
  const invoiceNumber = order.id.slice(0, 8).toUpperCase();

  return createPortal(
    <div
      className="invoice-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div aria-labelledby="invoice-title" aria-modal="true" className="invoice-dialog" role="dialog">
        <div className="invoice-toolbar no-print">
          <b>{title} سفارش #{invoiceNumber}</b>
          <div>
            <button className="invoice-print" onClick={() => window.print()} type="button">
              <Printer aria-hidden />
              چاپ / ذخیره PDF
            </button>
            <button aria-label="بستن" className="invoice-close" onClick={onClose} ref={closeRef} type="button">
              <X aria-hidden />
            </button>
          </div>
        </div>

        <article className="invoice-sheet">
          <header className="invoice-head">
            <div>
              {/* A plain <img> prints reliably (next/image may lazy-load). */}
              <img alt="کاغذ ۲۰" className="invoice-logo" src="/images/logo-kaghaz20.png" />
            </div>
            <div className="invoice-title-block">
              <h2 id="invoice-title">{title}</h2>
              <dl>
                <div><dt>شماره</dt><dd dir="ltr">{invoiceNumber}</dd></div>
                <div><dt>تاریخ</dt><dd>{dateTime(order.createdAt)}</dd></div>
                <div>
                  <dt>وضعیت</dt>
                  <dd><span className={`invoice-status ${paid ? "is-paid" : ""}`}>{statusLabels[order.status] || order.status}</span></dd>
                </div>
              </dl>
            </div>
          </header>

          <section className="invoice-parties">
            <div>
              <h3>فروشنده</h3>
              <p><b>{SELLER.name}</b></p>
              <p>{SELLER.address}</p>
              <p>
                تلفن: <span dir="ltr">{SELLER.phone}</span> · <span dir="ltr">{SELLER.email}</span> · <span dir="ltr">{SELLER.site}</span>
              </p>
            </div>
            <div>
              <h3>خریدار</h3>
              <p><b>{order.receiverFullName || "—"}</b></p>
              {order.receiverPhoneNumber ? <p>تلفن: <span dir="ltr">{order.receiverPhoneNumber}</span></p> : null}
              {order.shippingAddress ? <p className="invoice-address">{order.shippingAddress}</p> : null}
            </div>
          </section>

          <div className="invoice-table-wrap">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>ردیف</th>
                  <th>شرح کالا</th>
                  <th>تعداد</th>
                  <th>قیمت واحد</th>
                  <th>مبلغ کل</th>
                </tr>
              </thead>
              <tbody>
                {items.length ? (
                  items.map((item, index) => (
                    <tr key={item.id || `${order.id}-${index}`}>
                      <td>{fa.format(index + 1)}</td>
                      <td>{item.productName}</td>
                      <td>{fa.format(item.quantity)}</td>
                      <td>{item.unitPrice !== undefined ? toman(item.unitPrice) : "—"}</td>
                      <td>{toman(lineTotal(item))}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="invoice-empty" colSpan={5}>اطلاعات اقلام این سفارش موجود نیست.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <section className="invoice-totals">
            <dl>
              <div><dt>جمع اقلام</dt><dd>{toman(itemsTotal || order.totalAmount)}</dd></div>
              <div><dt>هزینه ارسال</dt><dd>پس‌کرایه</dd></div>
              <div className="invoice-grand"><dt>مبلغ نهایی</dt><dd>{toman(order.totalAmount)}</dd></div>
            </dl>
          </section>

          <footer className="invoice-foot">
            <p>شناسه کامل سفارش: <span dir="ltr">{order.id}</span></p>
            <p>این {title} به‌صورت الکترونیکی از سایت {SELLER.name} صادر شده است. از خرید شما سپاسگزاریم.</p>
          </footer>
        </article>
      </div>
    </div>,
    document.body,
  );
}
