"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

type Method = "mobile" | "email";

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const register = mode === "register";
  const [method, setMethod] = useState<Method>("mobile");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const identity = String(data.get("identity") || "").trim();
    const password = String(data.get("password") || "");
    if (!identity) return setError(method === "email" ? "لطفاً ایمیل خود را وارد کنید." : "لطفاً شماره موبایل خود را وارد کنید.");
    if (method === "email" && !identity.includes("@")) return setError("فرمت ایمیل صحیح نیست.");
    if (password.length < 6) return setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
    setError(""); setSuccess(true);
  };

  return (
    <main className="auth-shell">
      <section className="auth-simple-card">
        <Link href="/"><Image className="mx-auto h-auto w-[120px]" src="/images/logo-kaghaz20.png" alt="کاغذ ۲۰" width={150} height={72} priority /></Link>
        <h1>{register ? "ساخت حساب کاربری" : "ورود به حساب کاربری"}</h1>
        <p>{register ? "برای ثبت سفارش سریع، اطلاعات خود را وارد کنید." : "برای ادامه خرید وارد حساب خود شوید."}</p>
        <div className="auth-methods" role="tablist" aria-label="روش ورود">
          <button aria-selected={method === "mobile"} className={method === "mobile" ? "active" : ""} onClick={() => { setMethod("mobile"); setError(""); }} role="tab" type="button">شماره موبایل</button>
          <button aria-selected={method === "email"} className={method === "email" ? "active" : ""} onClick={() => { setMethod("email"); setError(""); }} role="tab" type="button">ورود با ایمیل</button>
        </div>
        {success ? <div className="auth-success" role="status"><b>{register ? "ثبت‌نام با موفقیت انجام شد." : "ورود با موفقیت انجام شد."}</b><Link href="/cart">ادامه ثبت سفارش</Link></div> : (
          <form className="auth-simple-form" onSubmit={submit} noValidate>
            {register && <label>نام و نام خانوادگی<input name="name" autoComplete="name" required placeholder="نام کامل شما" /></label>}
            <label>{method === "email" ? "ایمیل" : "شماره موبایل"}<input key={method} name="identity" type={method === "email" ? "email" : "tel"} inputMode={method === "email" ? "email" : "numeric"} autoComplete={method === "email" ? "email" : "tel"} placeholder={method === "email" ? "name@example.com" : "0912 345 6789"} /></label>
            <label>رمز عبور<div className="password-field"><input name="password" type={showPassword ? "text" : "password"} autoComplete={register ? "new-password" : "current-password"} placeholder="حداقل ۶ کاراکتر" /><button onClick={() => setShowPassword(!showPassword)} type="button">{showPassword ? "پنهان" : "نمایش"}</button></div></label>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="auth-main-action" type="submit">{register ? "ثبت‌نام و ادامه" : "ورود و ادامه خرید"}</button>
          </form>
        )}
        <div className="auth-switch-simple">{register ? "قبلاً حساب ساخته‌اید؟" : "حساب کاربری ندارید؟"} <Link href={register ? "/login" : "/register"}>{register ? "وارد شوید" : "ثبت‌نام کنید"}</Link></div>
        <Link className="auth-back" href="/shop">بازگشت به فروشگاه</Link>
      </section>
    </main>
  );
}
