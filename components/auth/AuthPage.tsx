"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type Method = "mobile" | "email";
type OtpState = "idle" | "checking" | "valid" | "invalid";

async function request(path: string, body: Record<string, string>) {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.message ||
        payload?.title ||
        payload?.errors?.[0] ||
        "ارتباط با سرور برقرار نشد. دوباره تلاش کنید.",
    );
  }

  return payload;
}

export function AuthPage({
  mode,
}: {
  mode: "login" | "register";
}) {
  const register = mode === "register";

  const [method, setMethod] = useState<Method>("mobile");
  const [mobileStep, setMobileStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpState, setOtpState] = useState<OtpState>("idle");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const root = document.documentElement;
    const viewport = window.visualViewport;

    const syncViewportHeight = () => {
      root.style.setProperty(
        "--auth-viewport-height",
        `${viewport?.height ?? window.innerHeight}px`,
      );
    };

    root.classList.add("auth-active");
    syncViewportHeight();

    viewport?.addEventListener("resize", syncViewportHeight);
    window.addEventListener("orientationchange", syncViewportHeight);

    return () => {
      viewport?.removeEventListener("resize", syncViewportHeight);
      window.removeEventListener("orientationchange", syncViewportHeight);

      root.classList.remove("auth-active");
      root.style.removeProperty("--auth-viewport-height");
    };
  }, []);

  const run = async (job: () => Promise<unknown>) => {
    setLoading(true);
    setError("");

    try {
      await job();
      return true;
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "خطای پیش‌بینی‌نشده رخ داد.",
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  const submitMain = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = Object.fromEntries(
      new FormData(event.currentTarget).entries(),
    ) as Record<string, string>;

    if (register) {
      const requiredFields = [
        "firstName",
        "lastName",
        "userName",
        "email",
        "phoneNumber",
        "password",
      ];

      if (requiredFields.some((key) => !data[key]?.trim())) {
        setError("لطفاً همه فیلدها را کامل کنید.");
        return;
      }

      if (!/^\S+@\S+\.\S+$/.test(data.email.trim())) {
        setError("فرمت ایمیل صحیح نیست.");
        return;
      }

      if (!/^09\d{9}$/.test(data.phoneNumber.trim())) {
        setError("شماره موبایل را با فرمت ۰۹xxxxxxxxx وارد کنید.");
        return;
      }

      const passwordIsValid =
        data.password.length >= 8 &&
        /[A-Z]/.test(data.password) &&
        /[a-z]/.test(data.password) &&
        /\d/.test(data.password);

      if (!passwordIsValid) {
        setError(
          "رمز عبور باید حداقل ۸ کاراکتر و شامل حرف بزرگ، حرف کوچک و عدد باشد.",
        );
        return;
      }

      const registered = await run(() =>
        request("/api/v1/Auth/Register", {
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          userName: data.userName.trim(),
          email: data.email.trim(),
          phoneNumber: data.phoneNumber.trim(),
          password: data.password,
        }),
      );

      if (registered) {
        window.location.assign("/account");
      }

      return;
    }

    const email = data.email?.trim() ?? "";
    const password = data.password ?? "";

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("یک ایمیل معتبر وارد کنید.");
      return;
    }

    if (!password) {
      setError("رمز عبور را وارد کنید.");
      return;
    }

    const loggedIn = await run(() =>
      request("/api/v1/Auth/Login", {
        email,
        password,
      }),
    );

    if (loggedIn) {
      window.location.assign("/account");
    }
  };

  const sendOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!/^09\d{9}$/.test(phone)) {
      setError("شماره موبایل را با فرمت ۰۹xxxxxxxxx وارد کنید.");
      return;
    }

    const sent = await run(() =>
      request("/api/v1/Auth/SendOtp", {
        mobileNo: phone,
      }),
    );

    if (sent) {
      setMobileStep("otp");
      setOtp(Array(6).fill(""));
      setOtpState("idle");

      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 50);
    }
  };

  const verifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const code = otp.join("");

    if (code.length !== 6) {
      setError("کد ۶ رقمی را کامل وارد کنید.");
      return;
    }

    setOtpState("checking");

    const verified = await run(() =>
      request("/api/v1/Auth/VerifyOtp", {
        mobile: phone,
        code,
      }),
    );

    setOtpState(verified ? "valid" : "invalid");

    if (verified) {
      setTimeout(() => {
        window.location.assign("/account");
      }, 350);
    }
  };

  const updateOtp = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    setOtpState("idle");

    setOtp((current) =>
      current.map((item, position) =>
        position === index ? digit : item,
      ),
    );

    if (digit) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const otpKey = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key === "Backspace" && !otp[index]) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <main className="auth-shell">
      <section
        className={`auth-simple-card ${
          register ? "auth-register-card" : ""
        }`}
      >
        <Link href="/">
          <Image
            className="mx-auto h-auto w-[120px]"
            src="/images/logo-kaghaz20.png"
            alt="کاغذ ۲۰"
            width={150}
            height={72}
            priority
          />
        </Link>

        <h1>
          {register ? "ساخت حساب کاربری" : "ورود به حساب کاربری"}
        </h1>

        <p>
          {register
            ? "اطلاعات زیر را برای ایجاد حساب کامل کنید."
            : "برای ادامه خرید وارد حساب خود شوید."}
        </p>

        {!register && (
          <div
            className="auth-methods"
            role="tablist"
            aria-label="روش ورود"
          >
            <button
              aria-selected={method === "mobile"}
              className={method === "mobile" ? "active" : ""}
              onClick={() => {
                setMethod("mobile");
                setMobileStep("phone");
                setError("");
              }}
              role="tab"
              type="button"
            >
              ورود با موبایل
            </button>

            <button
              aria-selected={method === "email"}
              className={method === "email" ? "active" : ""}
              onClick={() => {
                setMethod("email");
                setError("");
              }}
              role="tab"
              type="button"
            >
              ورود با ایمیل
            </button>
          </div>
        )}

        {register ? (
          <form
            className="auth-simple-form auth-register-form"
            onSubmit={submitMain}
            noValidate
          >
            <label>
              نام
              <input name="firstName" autoComplete="given-name" />
            </label>

            <label>
              نام خانوادگی
              <input name="lastName" autoComplete="family-name" />
            </label>

            <label>
              نام کاربری
              <input
                name="userName"
                autoComplete="username"
                dir="ltr"
              />
            </label>

            <label>
              ایمیل
              <input
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                dir="ltr"
              />
            </label>

            <label>
              شماره موبایل
              <input
                name="phoneNumber"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                placeholder="09123456789"
              />
            </label>

            <PasswordField
              show={showPassword}
              setShow={setShowPassword}
              register
            />

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="auth-main-action"
              disabled={loading}
              type="submit"
            >
              {loading ? "در حال ثبت‌نام…" : "ثبت‌نام"}
            </button>
          </form>
        ) : method === "email" ? (
          <form
            className="auth-simple-form"
            onSubmit={submitMain}
            noValidate
          >
            <label>
              ایمیل
              <input
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                dir="ltr"
                placeholder="name@example.com"
              />
            </label>

            <PasswordField
              show={showPassword}
              setShow={setShowPassword}
            />

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="auth-main-action"
              disabled={loading}
              type="submit"
            >
              {loading ? "در حال ورود…" : "ورود با ایمیل"}
            </button>
          </form>
        ) : mobileStep === "phone" ? (
          <form
            className="auth-simple-form"
            onSubmit={sendOtp}
            noValidate
          >
            <label>
              شماره موبایل
              <input
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value.replace(/\D/g, "").slice(0, 11),
                  )
                }
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                placeholder="09123456789"
              />
            </label>

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="auth-main-action"
              disabled={loading}
              type="submit"
            >
              {loading
                ? "در حال ارسال…"
                : "ارسال پیامک یکبار مصرف"}
            </button>
          </form>
        ) : (
          <form
            className="auth-simple-form"
            onSubmit={verifyOtp}
          >
            <p className="otp-hint">
              کد ارسال‌شده به <b dir="ltr">{phone}</b> را وارد کنید.
            </p>

            <div
              className={`otp-boxes ${otpState}`}
              dir="ltr"
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    otpRefs.current[index] = element;
                  }}
                  value={digit}
                  onChange={(event) =>
                    updateOtp(index, event.target.value)
                  }
                  onKeyDown={(event) => otpKey(event, index)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  autoComplete={
                    index === 0 ? "one-time-code" : "off"
                  }
                  aria-label={`رقم ${index + 1} کد`}
                />
              ))}
            </div>

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="auth-main-action"
              disabled={loading || otpState === "checking"}
              type="submit"
            >
              {loading ? "در حال بررسی…" : "تأیید و ورود"}
            </button>

            <button
              className="otp-back"
              type="button"
              onClick={() => {
                setMobileStep("phone");
                setOtp(Array(6).fill(""));
                setOtpState("idle");
                setError("");
              }}
            >
              اصلاح شماره موبایل
            </button>
          </form>
        )}

        <div className="auth-switch-simple">
          {register
            ? "قبلاً حساب ساخته‌اید؟"
            : "حساب کاربری ندارید؟"}{" "}
          <Link href={register ? "/login" : "/register"}>
            {register ? "وارد شوید" : "ثبت‌نام کنید"}
          </Link>
        </div>

        <Link className="auth-back" href="/shop">
          بازگشت به فروشگاه
        </Link>
      </section>
    </main>
  );
}

function PasswordField({
  show,
  setShow,
  register = false,
}: {
  show: boolean;
  setShow: (value: boolean) => void;
  register?: boolean;
}) {
  return (
    <label>
      رمز عبور

      <div className="password-field">
        <input
          name="password"
          type={show ? "text" : "password"}
          autoComplete={
            register ? "new-password" : "current-password"
          }
        />

        <button
          onClick={() => setShow(!show)}
          type="button"
        >
          {show ? "پنهان" : "نمایش"}
        </button>
      </div>
    </label>
  );
}