import type { Order, Profile } from "@/lib/account";
import { DashboardSidebar, EmptyRows, date, money } from "./DashboardParts";

const statusLabel: Record<string,string> = { Pending: "در حال پردازش", Processing: "در حال پردازش", Shipped: "ارسال شده", Delivered: "تحویل داده شده", Cancelled: "لغو شده" };
export function UserDashboard({ profile, orders }: { profile: Profile; orders: Order[] }) {
  const processing = orders.filter((o) => ["Pending","Processing"].includes(o.status)).length;
  const total = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  return <main className="dashboard-shell user-dashboard"><DashboardSidebar profile={profile}/><section className="dash-content">
    <header className="dash-welcome"><div><h1>سلام {profile.firstName || profile.userName} 👋</h1><p>خوش آمدید به پنل کاربری کاغذ ۲۰</p></div><a href="/">مشاهده فروشگاه</a></header>
    <div className="user-layout"><aside className="profile-card dash-card"><div className="avatar">●</div><h2>{profile.firstName} {profile.lastName}</h2><p>{profile.email}</p><span>♛ عضو ویژه</span><div className="profile-total"><small>مجموع خرید</small><b>{money(total)} <em>تومان</em></b></div><div className="level"><b>برای ارتقا به سطح طلایی</b><small>خریدهای بعدی امتیاز بیشتری دارند</small><i><u /></i></div></aside>
      <div className="user-main"><div className="metric-grid user-metrics">
        <article><i>▣</i><span>در حال پردازش<b>{processing}</b><small>سفارش</small></span></article><article><i>▢</i><span>سفارش‌های من<b>{orders.length}</b><small>سفارش</small></span></article><article><i>☆</i><span>امتیاز شما<b>{money(orders.length * 100)}</b><small>امتیاز</small></span></article><article><i>▤</i><span>مجموع خرید<b>{money(total)}</b><small>تومان</small></span></article>
      </div><section className="dash-card orders-card"><div className="card-title"><h2>آخرین سفارش‌ها</h2><a href="#">مشاهده همه ←</a></div>{orders.length ? <div className="table-wrap"><table><thead><tr><th>شماره سفارش</th><th>تاریخ ثبت</th><th>مبلغ</th><th>وضعیت</th></tr></thead><tbody>{orders.slice(0,5).map(o => <tr key={o.id}><td>#{o.id.slice(0,8)}</td><td>{date(o.createdAt)}</td><td>{money(o.totalAmount)} تومان</td><td><span className={`status ${o.status.toLowerCase()}`}>{statusLabel[o.status] || o.status}</span></td></tr>)}</tbody></table></div> : <EmptyRows text="هنوز سفارشی ثبت نشده است."/>}</section>
      <div className="support-banner"><div><b>تخفیف‌های ویژه برای خرید عمده</b><span>برای دریافت پیش‌فاکتور با ما در تماس باشید.</span></div><a href="/contact">دریافت پیش‌فاکتور</a></div></div>
    </div></section></main>;
}
