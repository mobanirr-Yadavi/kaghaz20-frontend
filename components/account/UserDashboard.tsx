"use client";

import { FormEvent, useState } from "react";
import type { Order, Profile } from "@/lib/account";
import { DashboardSidebar, EmptyRows, date, money } from "./DashboardParts";

const statusLabel: Record<string, string> = {
  Pending: "در حال پردازش",
  Processing: "در حال پردازش",
  Shipped: "ارسال شده",
  Delivered: "تحویل داده شده",
  Cancelled: "لغو شده",
};

type ApiResponse<T> = { isSuccess: boolean; data: T; message?: string };

export function UserDashboard({ profile, orders }: { profile: Profile; orders: Order[] }) {
  const [currentProfile, setCurrentProfile] = useState(profile);
  const [message, setMessage] = useState("");
  const processing = orders.filter((order) => ["Pending", "Processing"].includes(order.status)).length;
  const total = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  async function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/v1/Profile/UpdateProfile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: currentProfile.firstName,
        lastName: currentProfile.lastName,
        userName: currentProfile.userName,
        phoneNumber: currentProfile.phoneNumber,
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
          <aside id="profile" className="profile-card dash-card">
            <div className="avatar">●</div>
            <h2>{currentProfile.firstName} {currentProfile.lastName}</h2>
            <p>{currentProfile.email}</p>
            <span>حساب کاربری</span>
            <div className="profile-total">
              <small>مجموع خرید</small>
              <b>{money(total)} <em>تومان</em></b>
            </div>
          </aside>

          <div className="user-main">
            <div className="metric-grid user-metrics">
              <article><i>▣</i><span>در حال پردازش<b>{processing}</b><small>سفارش</small></span></article>
              <article><i>□</i><span>سفارش‌های من<b>{orders.length}</b><small>سفارش</small></span></article>
              <article><i>▤</i><span>مجموع خرید<b>{money(total)}</b><small>تومان</small></span></article>
            </div>

            <section className="dash-card">
              <div className="card-title"><h2>پروفایل و تنظیمات</h2><span>ویرایش اطلاعات حساب</span></div>
              <form className="admin-form" onSubmit={submitProfile}>
                <input required placeholder="نام" value={currentProfile.firstName} onChange={(e) => setCurrentProfile({ ...currentProfile, firstName: e.target.value })} />
                <input required placeholder="نام خانوادگی" value={currentProfile.lastName} onChange={(e) => setCurrentProfile({ ...currentProfile, lastName: e.target.value })} />
                <input required placeholder="نام کاربری" value={currentProfile.userName} onChange={(e) => setCurrentProfile({ ...currentProfile, userName: e.target.value })} />
                <input required placeholder="موبایل" value={currentProfile.phoneNumber} onChange={(e) => setCurrentProfile({ ...currentProfile, phoneNumber: e.target.value })} />
                <button type="submit">ذخیره پروفایل</button>
              </form>
            </section>

            <section id="orders" className="dash-card orders-card">
              <div className="card-title"><h2>آخرین سفارش‌ها</h2><a href="#orders">مشاهده همه ←</a></div>
              {orders.length ? (
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>شماره سفارش</th><th>تاریخ ثبت</th><th>مبلغ</th><th>وضعیت</th></tr></thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id.slice(0, 8)}</td>
                          <td>{date(order.createdAt)}</td>
                          <td>{money(order.totalAmount)} تومان</td>
                          <td><span className={`status ${order.status.toLowerCase()}`}>{statusLabel[order.status] || order.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <EmptyRows text="هنوز سفارشی ثبت نشده است." />}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
