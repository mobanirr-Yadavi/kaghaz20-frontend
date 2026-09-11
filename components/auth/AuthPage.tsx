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
import { isMobile, mobileOnInput, normalizeMobile, toEnglishDigits } from "@/lib/digits";
import { CooldownButton } from "./CooldownButton";

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

  // The backend can answer 200 with { isSuccess: false }; treat that as a failure too.
  if (!response.ok || payload?.isSuccess === false) {
    throw new Error(
      payload?.message ||
        payload?.title ||
        payload?.errors?.[0] ||
        "ارتباط با سرور برقرار نشد. دوباره تلاش کنید.",
    );
  }

  return payload;
}

const OTP_COOLDOWN_SECONDS = 120;
const otpSentKey = (mobile: string) => `kaghaz20-otp-sent-${mobile}`;

// Seconds before this number may request another code. This is only the UI countdown
// (rate limiting itself is the backend's job); kept in localStorage so a reload doesn't reset it.
function otpSecondsLeft(mobile: string) {
  try {
    const sentAt = Number(window.localStorage.getItem(otpSentKey(mobile)));
    const left = Math.ceil((sentAt + OTP_COOLDOWN_SECONDS * 1000 - Date.now()) / 1000);
    if (sentAt && left <= 0) window.localStorage.removeItem(otpSentKey(mobile));
    return sentAt ? Math.max(0, left) : 0;
  } catch {
    return 0;
  }
}

function markOtpSent(mobile: string) {
  try {
    window.localStorage.setItem(otpSentKey(mobile), String(Date.now()));
  } catch {
    // Storage may be blocked on some mobile browsers; the countdown is then skipped.
  }
}

// After a code is verified the wait is over, so the next login isn't blocked.
function clearOtpSent(mobile: string) {
  try {
    window.localStorage.removeItem(otpSentKey(mobile));
  } catch {
    // Storage may be blocked; nothing to clear.
  }
}

const faNumber = new Intl.NumberFormat("fa-IR");
const faTwoDigits = new Intl.NumberFormat("fa-IR", { minimumIntegerDigits: 2 });
const formatCountdown = (seconds: number) =>
  `${faNumber.format(Math.floor(seconds / 60))}:${faTwoDigits.format(seconds % 60)}`;

export function AuthPage({
  mode,
}: {
  mode: "login" | "register";
}) {
  const register = mode === "register";

  const [method, setMethod] = useState<Method>("mobile");
  const [mobileStep, setMobileStep] = useState<"phone" | "otp" | "profile">("phone");
  const [phone, setPhone] = useState("");
  const [registrationToken, setRegistrationToken] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpState, setOtpState] = useState<OtpState>("idle");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [otpCooldown, setOtpCooldown] = useState(0);
  // 0 → 1 over the 2-minute wait; drives the fill on the send/resend buttons.
  const cooldownProgress = otpCooldown > 0 ? (OTP_COOLDOWN_SECONDS - otpCooldown) / OTP_COOLDOWN_SECONDS : null;

  useEffect(() => {
    if (!isMobile(phone)) {
      setOtpCooldown(0);
      return;
    }

    const tick = () => setOtpCooldown(otpSecondsLeft(phone));
    tick();
    const timer = window.setInterval(tick, 1000);

    return () => window.clearInterval(timer);
  }, [phone]);

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

      const email = toEnglishDigits(data.email.trim());
      const phoneNumber = normalizeMobile(data.phoneNumber);

      if (!/^\S+@\S+\.\S+$/.test(email)) {
        setError("فرمت ایمیل صحیح نیست.");
        return;
      }

      if (!isMobile(phoneNumber)) {
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
          email,
          phoneNumber,
          password: data.password,
        }),
      );

      if (registered) {
        window.location.assign("/account");
      }

      return;
    }

    const email = toEnglishDigits(data.email?.trim() ?? "");
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

  const requestOtp = async () => {
    if (!isMobile(phone)) {
      setError("شماره موبایل را با فرمت ۰۹xxxxxxxxx وارد کنید.");
      return;
    }

    const wait = otpSecondsLeft(phone);

    if (wait > 0) {
      setError(`برای دریافت کد جدید ${formatCountdown(wait)} دیگر صبر کنید.`);
      return;
    }

    const sent = await run(() =>
      request("/api/v1/Auth/SendOtp", {
        mobileNo: phone,
      }),
    );

    if (sent) {
      markOtpSent(phone);
      setOtpCooldown(OTP_COOLDOWN_SECONDS);
      setMobileStep("otp");
      setOtp(Array(6).fill(""));
      setOtpState("idle");

      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 50);
    }
  };

  const sendOtp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void requestOtp();
  };

  const verifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const code = otp.join("");

    if (code.length !== 6) {
      setError("کد ۶ رقمی را کامل وارد کنید.");
      return;
    }

    setOtpState("checking");
    setLoading(true);
    setError("");

    try {
      const payload = await request("/api/v1/Auth/VerifyOtp", {
        mobile: phone,
        code,
      });
      const data = payload?.data;

      setOtpState("valid");
      clearOtpSent(phone);
      setOtpCooldown(0);

      if (typeof data?.registrationToken === "string" && !data?.accessToken) {
        setRegistrationToken(data.registrationToken);
        setMobileStep("profile");
        setOtpState("idle");
        return;
      }

      setTimeout(() => {
        window.location.assign("/account");
      }, 350);
    } catch (reason) {
      setOtpState("invalid");
      setError(
        reason instanceof Error
          ? reason.message
          : "کد واردشده معتبر نیست.",
      );
    } finally {
      setLoading(false);
    }
  };

  const completeMobileRegistration = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const firstName = String(form.get("firstName") || "").trim();
    const lastName = String(form.get("lastName") || "").trim();
    const email = toEnglishDigits(String(form.get("email") || "").trim());

    if (!firstName || !lastName) {
      setError("نام و نام خانوادگی را کامل وارد کنید.");
      return;
    }

    const completed = await run(() =>
      request("/api/v1/Auth/CompleteRegistration", {
        registrationToken,
        firstName,
        lastName,
        email,
      }),
    );

    if (completed) {
      window.location.assign("/account");
    }
  };

  const updateOtp = (index: number, value: string) => {
    const digits = toEnglishDigits(value).replace(/\D/g, "");

    setOtpState("idle");

    // The browser's one-time-code suggestion (or a paste) puts the whole code
    // into one box: spread it across the boxes instead of keeping one digit.
    if (digits.length > 2 || (digits.length === 2 && !otp[index])) {
      const start = digits.length >= otp.length ? 0 : index;
      const next = [...otp];

      digits
        .slice(0, otp.length - start)
        .split("")
        .forEach((item, offset) => {
          next[start + offset] = item;
        });

      setOtp(next);
      otpRefs.current[Math.min(start + digits.length, otp.length) - 1]?.focus();
      return;
    }

    // Typing into a filled box yields old + new digit; keep the new one.
    const digit =
      digits.length === 2
        ? digits[0] === otp[index]
          ? digits[1]
          : digits[0]
        : digits;

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
                onInput={mobileOnInput}
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
                    normalizeMobile(event.target.value).slice(0, 11),
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

            <CooldownButton
              className="auth-main-action"
              disabled={loading || otpCooldown > 0}
              progress={loading ? null : cooldownProgress}
              type="submit"
            >
              {loading
                ? "در حال ارسال…"
                : otpCooldown > 0
                  ? `ارسال مجدد تا ${formatCountdown(otpCooldown)}`
                  : "ارسال پیامک یکبار مصرف"}
            </CooldownButton>
          </form>
        ) : mobileStep === "otp" ? (
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
                  maxLength={otp.length}
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

            <CooldownButton
              className="otp-resend"
              type="button"
              disabled={loading || otpCooldown > 0}
              progress={loading ? null : cooldownProgress}
              onClick={() => void requestOtp()}
            >
              {otpCooldown > 0
                ? `ارسال مجدد کد تا ${formatCountdown(otpCooldown)}`
                : "ارسال مجدد کد"}
            </CooldownButton>

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
        ) : (
          <form
            className="auth-simple-form"
            onSubmit={completeMobileRegistration}
            noValidate
          >
            <p className="otp-hint">
              شماره شما تأیید شد. برای تکمیل ثبت‌نام، مشخصاتتان را وارد کنید.
            </p>

            <label>
              نام
              <input name="firstName" autoComplete="given-name" required />
            </label>

            <label>
              نام خانوادگی
              <input name="lastName" autoComplete="family-name" required />
            </label>

            <label>
              ایمیل (اختیاری)
              <input
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                dir="ltr"
              />
            </label>

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="auth-main-action"
              disabled={loading || !registrationToken}
              type="submit"
            >
              {loading ? "در حال ثبت اطلاعات…" : "تکمیل ثبت‌نام و ورود"}
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
