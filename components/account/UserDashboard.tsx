"use client";

import { FormEvent, useState } from "react";
import type { Order, Profile } from "@/lib/account";
import { isMobile, normalizeMobile } from "@/lib/digits";
import { backendFetch, backendGetPaged } from "@/lib/backend";
import { ORDERS_PAGE_SIZE, type PagedResult } from "@/lib/pagination";
import { usePagedList } from "@/lib/usePagedList";
import { Pagination } from "@/components/ui/Pagination";
import { Hourglass, PackageCheck, Wallet } from "lucide-react";
import { DashboardSidebar, EmptyRows, date, money } from "./DashboardParts";
import { InvoiceButton, InvoiceModal } from "./InvoiceModal";

const statusLabel: Record<string, string> = {
  Paid: "پرداخت‌شده",
  Pending: "در حال پردازش",
  Processing: "در حال پردازش",
  Shipped: "ارسال شده",
  Delivered: "تحویل داده شده",
  Cancelled: "لغو شده",
};

type ApiResponse<T> = { isSuccess: boolean; data: T; message?: string };

export function UserDashboard({
  profile,
  orders,
  initialOrdersPage,
}: {
  profile: Profile;
  orders: Order[];
  initialOrdersPage: PagedResult<Order> | null;
}) {
  const [currentProfile, setCurrentProfile] = useState(profile);
  const ordersPage = usePagedList({
    queryKey: "user-orders",
    initial: initialOrdersPage,
    load: (pageNumber) =>
      backendGetPaged<Order>(
        "/Order/GetUserOrdersPaged",
        pageNumber,
        ORDERS_PAGE_SIZE,
      ),
  });
  const pageOrders = ordersPage.data?.items ?? [];
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [message, setMessage] = useState("");
  const processing = orders.filter((order) =>
    ["Pending", "Processing"].includes(order.status),
  ).length;
  const paidOrders = orders.filter(
    (order) => order.status.toLowerCase() === "paid",
  );
  const total = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  async function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const phoneNumber = normalizeMobile(currentProfile.phoneNumber || "");
    if (!isMobile(phoneNumber)) {
      setMessage("شماره موبایل را با فرمت ۰۹xxxxxxxxx وارد کنید.");
      return;
    }
    const response = await backendFetch("/Profile/UpdateProfile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: currentProfile.firstName,
        lastName: currentProfile.lastName,
        userName: currentProfile.userName,
        phoneNumber,
      }),
    });
    const payload = (await response.json()) as ApiResponse<Profile>;
    if (!response.ok || !payload.isSuccess) {
      setMessage(payload.message || "ویرایش پروفایل انجام نشد.");
      return;
    }
    setCurrentProfile(payload.data);
    setMessage("پروفایل با موفقیت ذخیره شد.");
  }

  return (
    <main className="dashboard-shell user-dashboard">
      <DashboardSidebar profile={currentProfile} />
      <section className="dash-content">
        <header className="dash-welcome">
          <div>
            <h1>سلام {currentProfile.firstName || currentProfile.userName}</h1>
            <p>خوش آمدید به پنل کاربری کاغذ ۲۰</p>
          </div>
          <a href="/shop">مشاهده فروشگاه</a>
        </header>

        {message ? <div className="dash-empty">{message}</div> : null}

        <div className="user-layout">
          <div className="user-main">
            <div className="metric-grid user-metrics">
              <article>
                <i><Hourglass aria-hidden /></i>
                <span>
                  در حال پردازش<b>{processing}</b>
                  <small>سفارش</small>
                </span>
              </article>
              <article>
                <i><PackageCheck aria-hidden /></i>
                <span>
                  سفارش‌های پرداخت‌شده<b>{paidOrders.length}</b>
                  <small>سفارش</small>
                </span>
              </article>
              <article>
                <i><Wallet aria-hidden /></i>
                <span>
                  مجموع خرید<b>{money(total)}</b>
                  <small>تومان</small>
                </span>
              </article>
            </div>

            <section id="profile" className="dash-card scroll-mt-24">
              <div className="card-title">
                <h2>پروفایل و تنظیمات</h2>
                <span>ویرایش اطلاعات حساب</span>
              </div>
              <form className="admin-form" onSubmit={submitProfile}>
                <input
                  required
                  placeholder="نام"
                  value={currentProfile.firstName}
                  onChange={(e) =>
                    setCurrentProfile({
                      ...currentProfile,
                      firstName: e.target.value,
                    })
                  }
                />
                <input
                  required
                  placeholder="نام خانوادگی"
                  value={currentProfile.lastName}
                  onChange={(e) =>
                    setCurrentProfile({
                      ...currentProfile,
                      lastName: e.target.value,
                    })
                  }
                />
                <input
                  required
                  placeholder="نام کاربری"
                  value={currentProfile.userName}
                  onChange={(e) =>
                    setCurrentProfile({
                      ...currentProfile,
                      userName: e.target.value,
                    })
                  }
                />
                <input
                  required
                  inputMode="tel"
                  placeholder="موبایل"
                  value={currentProfile.phoneNumber}
                  onChange={(e) =>
                    setCurrentProfile({
                      ...currentProfile,
                      phoneNumber: normalizeMobile(e.target.value).slice(0, 11),
                    })
                  }
                />
                <button type="submit">ذخیره پروفایل</button>
              </form>
            </section>

            <section id="orders" className="dash-card orders-card">
              <div className="card-title">
                <h2>سفارش‌های من</h2>
                {ordersPage.data ? (
                  <span>{money(ordersPage.data.totalCount)} سفارش</span>
                ) : null}
              </div>
              {ordersPage.error ? (
                <div className="dash-empty dash-error" role="alert">
                  <span>{ordersPage.error}</span>
                  <button type="button" onClick={ordersPage.retry}>
                    تلاش دوباره
                  </button>
                </div>
              ) : !ordersPage.data ? (
                <EmptyRows text="در حال دریافت سفارش‌ها…" />
              ) : pageOrders.length ? (
                <div
                  aria-busy={ordersPage.loading}
                  className={`table-wrap ${ordersPage.loading ? "is-loading" : ""}`}
                >
                  <table>
                    <thead>
                      <tr>
                        <th>شماره سفارش</th>
                        <th>تاریخ ثبت</th>
                        <th>مبلغ</th>
                        <th>وضعیت</th>
                        <th>فاکتور</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageOrders.map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id.slice(0, 8)}</td>
                          <td>{date(order.createdAt)}</td>
                          <td>{money(order.totalAmount)} تومان</td>
                          <td>
                            <span
                              className={`status ${order.status.toLowerCase()}`}
                            >
                              {statusLabel[order.status] || order.status}
                            </span>
                          </td>
                          <td>
                            <InvoiceButton onClick={() => setInvoiceOrder(order)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyRows text="هنوز سفارشی ثبت نشده است." />
              )}
              {ordersPage.data && !ordersPage.error ? (
                <Pagination
                  className="dash-pagination"
                  disabled={ordersPage.loading}
                  onChange={ordersPage.setPage}
                  page={ordersPage.page}
                  totalPages={ordersPage.data.totalPages}
                />
              ) : null}
            </section>
          </div>
        </div>
      </section>
      <InvoiceModal onClose={() => setInvoiceOrder(null)} order={invoiceOrder} />
    </main>
  );
}
