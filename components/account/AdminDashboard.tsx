"use client";

import { FormEvent, useMemo, useState } from "react";
import type { AdminCategory, AdminProduct, AdminStats, AdminUser, Order, Profile } from "@/lib/account";
import { DashboardSidebar, EmptyRows, date, money } from "./DashboardParts";

type ProductForm = { name: string; description: string; price: string; stock: string; categoryId: string };
type CategoryForm = { name: string; description: string };
type ApiResponse<T> = { isSuccess: boolean; data: T; message?: string };

const emptyCategory: CategoryForm = { name: "", description: "" };

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
}: {
  profile: Profile;
  stats: AdminStats;
  orders: Order[];
  users: AdminUser[];
  products: AdminProduct[];
  categories: AdminCategory[];
}) {
  const [productRows, setProductRows] = useState(products);
  const [categoryRows, setCategoryRows] = useState(categories);
  const [userRows, setUserRows] = useState(users);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const firstCategoryId = categoryRows[0]?.id || "";
  const emptyProduct = useMemo<ProductForm>(() => ({ name: "", description: "", price: "", stock: "", categoryId: firstCategoryId }), [firstCategoryId]);
  const [productForm, setProductForm] = useState<ProductForm>({ name: "", description: "", price: "", stock: "", categoryId: firstCategoryId });
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(emptyCategory);

  const customers = userRows.filter((user) => user.role.toLowerCase() !== "admin");

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
          <div><h1>خوش آمدید، مدیر سیستم</h1><p>مدیریت محصولات، دسته‌بندی‌ها و مشتریان</p></div>
          <a href="/">مشاهده سایت</a>
        </header>

        {message ? <div className="dash-empty">{message}</div> : null}

        <div id="admin-stats" className="metric-grid admin-metrics">
          <article><i>◇</i><span>تعداد محصولات<b>{money(productRows.length || stats.totalProducts)}</b><small>محصول</small></span></article>
          <article><i>□</i><span>تعداد سفارش‌ها<b>{money(stats.totalOrders)}</b><small>سفارش</small></span></article>
          <article><i>♙</i><span>تعداد مشتریان<b>{money(customers.length || stats.totalUsers)}</b><small>مشتری</small></span></article>
          <article><i>◎</i><span>کل فروش<b>{money(stats.totalRevenue)}</b><small>تومان</small></span></article>
        </div>

        <div className="admin-grid">
          <section id="admin-products" className="dash-card admin-orders">
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

          <section id="admin-categories" className="dash-card new-users">
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

          <section id="admin-users" className="dash-card admin-orders">
            <div className="card-title"><h2>مشتریان و مدیریت کاربران</h2></div>
            {customers.length ? (
              <div className="table-wrap"><table><thead><tr><th>نام</th><th>نام کاربری</th><th>ایمیل</th><th>موبایل</th><th>عضویت</th><th>عملیات</th></tr></thead><tbody>
                {customers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.firstName} {user.lastName}</td><td>{user.userName}</td><td>{user.email}</td><td>{user.phoneNumber}</td><td>{date(user.createdAt)}</td>
                    <td><button type="button" onClick={() => deleteUser(user.id)}>حذف</button></td>
                  </tr>
                ))}
              </tbody></table></div>
            ) : <EmptyRows text="مشتری وجود ندارد." />}
          </section>

          <section id="admin-orders" className="dash-card new-users">
            <div className="card-title"><h2>سفارش‌های اخیر</h2></div>
            {orders.length ? (
              <div className="table-wrap"><table><thead><tr><th>سفارش</th><th>مشتری</th><th>مبلغ</th><th>وضعیت</th></tr></thead><tbody>
                {orders.slice(0, 5).map((order) => <tr key={order.id}><td>#{order.id.slice(0, 7)}</td><td>{order.receiverFullName}</td><td>{money(order.totalAmount)}</td><td>{order.status}</td></tr>)}
              </tbody></table></div>
            ) : <EmptyRows text="سفارشی وجود ندارد." />}
          </section>
        </div>
      </section>
    </main>
  );
}
