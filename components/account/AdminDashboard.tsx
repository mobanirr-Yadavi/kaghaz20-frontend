"use client";

import { FormEvent, Fragment, useMemo, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import type { AdminCategory, AdminProduct, AdminStats, AdminUser, Order, Profile } from "@/lib/account";
import { DashboardSidebar, EmptyRows, date, money } from "./DashboardParts";

// Shared Jalali date picker setup; portal keeps the calendar out of the wrapping <label> and card overflow.
const jalaliPickerProps = { calendar: persian, locale: persian_fa, calendarPosition: "bottom-right", portal: true, containerStyle: { width: "100%" }, placeholder: "انتخاب تاریخ" } as const;

type ProductForm = { name: string; description: string; price: string; stock: string; categoryId: string };
type CategoryForm = { name: string; description: string };
type ApiResponse<T> = { isSuccess: boolean; data: T; message?: string };

const emptyCategory: CategoryForm = { name: "", description: "" };
export type AdminView = "overview" | "orders" | "products" | "categories" | "customers";

const orderStatusLabels: Record<string, string> = {
  Paid: "پرداخت‌شده",
  Pending: "در انتظار پرداخت",
  Processing: "در حال پردازش",
  Shipped: "ارسال‌شده",
  Delivered: "تحویل‌شده",
  Cancelled: "لغوشده",
};

const viewTitles: Record<AdminView, { title: string; description: string }> = {
  overview: { title: "داشبورد مدیریت", description: "نمای کلی وضعیت فروشگاه کاغذ ۲۰" },
  orders: { title: "مدیریت سفارش‌ها", description: "مشاهده همه سفارش‌های ثبت‌شده" },
  products: { title: "مدیریت محصولات", description: "افزودن، ویرایش و کنترل موجودی محصولات" },
  categories: { title: "مدیریت دسته‌بندی‌ها", description: "ساخت و ویرایش دسته‌بندی محصولات" },
  customers: { title: "مشتریان", description: "مشاهده و مدیریت تمام مشتریان فروشگاه" },
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/v1${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !payload.isSuccess) throw new Error(payload.message || "عملیات انجام نشد.");
  return payload.data;
}

export function AdminDashboard({
  profile,
  stats,
  orders,
  users,
  products,
  categories,
  view = "overview",
}: {
  profile: Profile;
  stats: AdminStats;
  orders: Order[];
  users: AdminUser[];
  products: AdminProduct[];
  categories: AdminCategory[];
  view?: AdminView;
}) {
  const [productRows, setProductRows] = useState(products);
  const [categoryRows, setCategoryRows] = useState(categories);
  const [userRows, setUserRows] = useState(users);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderFromDate, setOrderFromDate] = useState<DateObject | null>(null);
  const [orderToDate, setOrderToDate] = useState<DateObject | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const firstCategoryId = categoryRows[0]?.id || "";
  const emptyProduct = useMemo<ProductForm>(() => ({ name: "", description: "", price: "", stock: "", categoryId: firstCategoryId }), [firstCategoryId]);
  const [productForm, setProductForm] = useState<ProductForm>({ name: "", description: "", price: "", stock: "", categoryId: firstCategoryId });
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(emptyCategory);

  const customers = userRows.filter((user) => user.role.toLowerCase() !== "admin");
  const recentCustomers = [...customers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const paidOrders = recentOrders.filter((order) => order.status.toLowerCase() === "paid");
  const orderFromTime = orderFromDate ? orderFromDate.toDate().setHours(0, 0, 0, 0) : -Infinity;
  const orderToTime = orderToDate ? orderToDate.toDate().setHours(23, 59, 59, 999) : Infinity;
  const filteredOrders = recentOrders.filter((order) => {
    const statusMatches = orderStatusFilter === "all" || order.status.toLowerCase() === orderStatusFilter.toLowerCase();
    const createdAt = new Date(order.createdAt).getTime();
    return statusMatches && createdAt >= orderFromTime && createdAt <= orderToTime;
  });
  const visibleCustomers = view === "overview" ? recentCustomers.slice(0, 5) : recentCustomers;
  const visibleOrders = view === "overview" ? paidOrders.slice(0, 5) : filteredOrders;

  async function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const body = {
      name: productForm.name,
      description: productForm.description || null,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      categoryId: productForm.categoryId,
    };
    try {
      const saved = editingProductId
        ? await request<AdminProduct>(`/Product/Update/${editingProductId}`, { method: "PUT", body: JSON.stringify(body) })
        : await request<AdminProduct>("/Product/Create", { method: "POST", body: JSON.stringify(body) });
      setProductRows((rows) => editingProductId ? rows.map((item) => item.id === saved.id ? saved : item) : [saved, ...rows]);
      setEditingProductId(null);
      setProductForm(emptyProduct);
      setMessage("محصول ذخیره شد.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "خطا در ذخیره محصول");
    }
  }

  async function submitCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const body = { name: categoryForm.name, description: categoryForm.description || null };
    try {
      const saved = editingCategoryId
        ? await request<AdminCategory>(`/Category/Update/${editingCategoryId}`, { method: "PUT", body: JSON.stringify(body) })
        : await request<AdminCategory>("/Category/Create", { method: "POST", body: JSON.stringify(body) });
      setCategoryRows((rows) => editingCategoryId ? rows.map((item) => item.id === saved.id ? saved : item) : [saved, ...rows]);
      setProductRows((rows) => rows.map((product) => product.categoryId === saved.id ? { ...product, categoryName: saved.name } : product));
      setEditingCategoryId(null);
      setCategoryForm(emptyCategory);
      setMessage("دسته‌بندی ذخیره شد.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "خطا در ذخیره دسته‌بندی");
    }
  }

  function editProduct(product: AdminProduct) {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      stock: String(product.stock),
      categoryId: product.categoryId,
    });
  }

  function editCategory(category: AdminCategory) {
    setEditingCategoryId(category.id);
    setCategoryForm({ name: category.name, description: category.description || "" });
  }

  async function deleteProduct(id: string) {
    if (!confirm("این محصول حذف شود؟")) return;
    try {
      await request<boolean>(`/Product/Delete/${id}`, { method: "DELETE" });
      setProductRows((rows) => rows.filter((item) => item.id !== id));
      setMessage("محصول حذف شد.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "خطا در حذف محصول");
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm("این دسته‌بندی حذف شود؟")) return;
    try {
      await request<boolean>(`/Category/Delete/${id}`, { method: "DELETE" });
      setCategoryRows((rows) => rows.filter((item) => item.id !== id));
      setMessage("دسته‌بندی حذف شد.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "خطا در حذف دسته‌بندی");
    }
  }

  async function deleteUser(id: string) {
    if (!confirm("این کاربر حذف شود؟")) return;
    try {
      await request<boolean>(`/Admin/DeleteUser/${id}`, { method: "DELETE" });
      setUserRows((rows) => rows.filter((item) => item.id !== id));
      setMessage("کاربر حذف شد.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "خطا در حذف کاربر");
    }
  }

  return (
    <main className="dashboard-shell admin-dashboard">
      <DashboardSidebar profile={profile} admin />
      <section className="dash-content">
        <header className="dash-welcome admin-head">
          <div><h1>{viewTitles[view].title}</h1><p>{viewTitles[view].description}</p></div>
          <a href="/">مشاهده سایت</a>
        </header>

        {message ? <div className="dash-empty">{message}</div> : null}

        <div id="admin-stats" className={`metric-grid admin-metrics ${view !== "overview" ? "is-hidden" : ""}`}>
          <article><i>◇</i><span>تعداد محصولات<b>{money(productRows.length || stats.totalProducts)}</b><small>محصول</small></span></article>
          <article><i>□</i><span>سفارش‌های پرداخت‌شده<b>{money(paidOrders.length)}</b><small>سفارش</small></span></article>
          <article><i>♙</i><span>تعداد مشتریان<b>{money(customers.length || stats.totalUsers)}</b><small>مشتری</small></span></article>
          <article>
  <i>◎</i>
  <span>
    کل فروش
    <b>
      {money(
        paidOrders.reduce(
          (total, order) => total + (order.totalAmount || 0),
          0
        )
      )}
    </b>
    <small>تومان</small>
  </span>
</article>
        </div>

        <div className={`admin-grid ${view !== "overview" ? "admin-single-view" : ""}`}>
          <section id="admin-products" className={`dash-card admin-orders ${view !== "products" ? "is-hidden" : ""}`}>
            <div className="card-title"><h2>محصولات</h2><span>{editingProductId ? "ویرایش محصول" : "محصول جدید"}</span></div>
            <form className="admin-form" onSubmit={submitProduct}>
              <input required placeholder="نام محصول" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
              <input placeholder="توضیحات" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
              <input required min="0" type="number" placeholder="قیمت" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
              <input required min="0" type="number" placeholder="تعداد" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} />
              <select required value={productForm.categoryId} onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}>
                <option value="">انتخاب دسته‌بندی</option>
                {categoryRows.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
              <button type="submit">{editingProductId ? "ذخیره ویرایش" : "افزودن محصول"}</button>
              {editingProductId ? <button type="button" onClick={() => { setEditingProductId(null); setProductForm(emptyProduct); }}>انصراف</button> : null}
            </form>
            {productRows.length ? (
              <div className="table-wrap"><table><thead><tr><th>نام</th><th>دسته‌بندی</th><th>قیمت</th><th>تعداد</th><th>عملیات</th></tr></thead><tbody>
                {productRows.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td><td>{product.categoryName || "-"}</td><td>{money(product.price)}</td><td>{money(product.stock)}</td>
                    <td><button type="button" onClick={() => editProduct(product)}>ویرایش</button> <button type="button" onClick={() => deleteProduct(product.id)}>حذف</button></td>
                  </tr>
                ))}
              </tbody></table></div>
            ) : <EmptyRows text="محصولی وجود ندارد." />}
          </section>

          <section id="admin-categories" className={`dash-card new-users ${view !== "categories" ? "is-hidden" : ""}`}>
            <div className="card-title"><h2>دسته‌بندی‌ها</h2><span>{editingCategoryId ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}</span></div>
            <form className="admin-form" onSubmit={submitCategory}>
              <input required placeholder="نام دسته‌بندی" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} />
              <input placeholder="توضیحات" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
              <button type="submit">{editingCategoryId ? "ذخیره ویرایش" : "افزودن دسته‌بندی"}</button>
              {editingCategoryId ? <button type="button" onClick={() => { setEditingCategoryId(null); setCategoryForm(emptyCategory); }}>انصراف</button> : null}
            </form>
            {categoryRows.length ? (
              <div className="table-wrap"><table><thead><tr><th>نام</th><th>توضیحات</th><th>عملیات</th></tr></thead><tbody>
                {categoryRows.map((category) => (
                  <tr key={category.id}>
                    <td>{category.name}</td><td>{category.description || "-"}</td>
                    <td><button type="button" onClick={() => editCategory(category)}>ویرایش</button> <button type="button" onClick={() => deleteCategory(category.id)}>حذف</button></td>
                  </tr>
                ))}
              </tbody></table></div>
            ) : <EmptyRows text="دسته‌بندی وجود ندارد." />}
          </section>

          <section id="admin-users" className={`dash-card admin-orders ${!["overview", "customers"].includes(view) ? "is-hidden" : ""}`}>
            <div className="card-title"><h2>{view === "overview" ? "۵ مشتری جدید" : "همه مشتریان"}</h2>{view === "overview" ? <a href="/account/customers">مشاهده همه</a> : <span>{money(customers.length)} مشتری</span>}</div>
            {visibleCustomers.length ? (
              <div className="table-wrap"><table><thead><tr><th>نام</th><th>نام کاربری</th><th>ایمیل</th><th>موبایل</th><th>عضویت</th><th>عملیات</th></tr></thead><tbody>
                {visibleCustomers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.firstName} {user.lastName}</td><td>{user.userName}</td><td>{user.email}</td><td>{user.phoneNumber}</td><td>{date(user.createdAt)}</td>
                    <td><button type="button" onClick={() => deleteUser(user.id)}>حذف</button></td>
                  </tr>
                ))}
              </tbody></table></div>
            ) : <EmptyRows text="مشتری وجود ندارد." />}
          </section>

          <section id="admin-orders" className={`dash-card new-users ${!["overview", "orders"].includes(view) ? "is-hidden" : ""}`}>
            <div className="card-title"><h2>{view === "overview" ? "۵ سفارش پرداخت‌شده اخیر" : "همه سفارش‌ها"}</h2>{view === "overview" ? <a href="/account/orders">مشاهده همه</a> : <span>{money(visibleOrders.length)} سفارش</span>}</div>
            {view === "orders" ? (
              <div className="order-filters">
                <label><span>وضعیت سفارش</span><select value={orderStatusFilter} onChange={(event) => setOrderStatusFilter(event.target.value)}><option value="all">همه وضعیت‌ها</option><option value="Paid">فقط پرداخت‌شده‌ها</option><option value="Pending">در انتظار پرداخت</option><option value="Processing">در حال پردازش</option><option value="Shipped">ارسال‌شده</option><option value="Delivered">تحویل‌شده</option><option value="Cancelled">لغوشده</option></select></label>
                <label><span>از تاریخ</span><DatePicker {...jalaliPickerProps} value={orderFromDate} maxDate={orderToDate ?? undefined} onChange={(value) => setOrderFromDate(value instanceof DateObject ? value : null)} /></label>
                <label><span>تا تاریخ</span><DatePicker {...jalaliPickerProps} value={orderToDate} minDate={orderFromDate ?? undefined} onChange={(value) => setOrderToDate(value instanceof DateObject ? value : null)} /></label>
                <button type="button" onClick={() => { setOrderStatusFilter("all"); setOrderFromDate(null); setOrderToDate(null); }}>پاک‌کردن فیلترها</button>
              </div>
            ) : null}
            {visibleOrders.length ? (
              <div className="table-wrap"><table className="orders-table"><thead><tr><th>شناسه سفارش</th><th>مشتری</th><th>مبلغ</th><th>تاریخ سفارش</th><th>وضعیت</th></tr></thead><tbody>
                {visibleOrders.map((order) => (
                  <Fragment key={order.id}>
                    <tr className="order-row" tabIndex={0} onClick={() => setExpandedOrderId((current) => current === order.id ? null : order.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setExpandedOrderId((current) => current === order.id ? null : order.id); }}>
                      <td><button type="button" className="order-id-button" aria-expanded={expandedOrderId === order.id}>#{order.id.slice(0, 8)} <span>{expandedOrderId === order.id ? "▲" : "▼"}</span></button></td>
                      <td>{order.receiverFullName || "بدون نام"}</td><td>{money(order.totalAmount)} تومان</td><td>{date(order.createdAt)}</td><td><span className={`status ${order.status.toLowerCase()}`}>{orderStatusLabels[order.status] || order.status}</span></td>
                    </tr>
                    {expandedOrderId === order.id ? <tr className="order-details-row"><td colSpan={5}><div className="order-details"><div className="order-details-head"><b>اقلام این سفارش</b><span>شناسه کامل: <span dir="ltr">{order.id}</span></span></div>{order.items?.length ? <div className="order-items">{order.items.map((item, index) => <article key={item.id || `${order.id}-${index}`}><div><b>{item.productName}</b><small>تعداد: {money(item.quantity)}</small></div><strong>{money(item.totalPrice ?? (item.unitPrice || 0) * item.quantity)} تومان</strong></article>)}</div> : <p>اطلاعات اقلام این سفارش موجود نیست.</p>}{order.shippingAddress ? <div className="order-shipping"><b>اطلاعات ارسال:</b><span>{order.shippingAddress}</span></div> : null}</div></td></tr> : null}
                  </Fragment>
                ))}
              </tbody></table></div>
            ) : <EmptyRows text={view === "overview" ? "هنوز سفارش پرداخت‌شده‌ای وجود ندارد." : "سفارشی وجود ندارد."} />}
          </section>
        </div>
      </section>
    </main>
  );
}
