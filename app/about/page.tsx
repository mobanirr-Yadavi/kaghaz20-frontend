import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AboutIcon, type AboutIconName } from "@/components/pages/AboutIcon";

export const metadata: Metadata = {
  title: "درباره ما",
  description:
    "داستان کاغذ ۲۰: حذف واسطه‌ها و خرید ساده‌تر، سریع‌تر و مقرون‌به‌صرفه‌تر کاغذ با تکیه بر فناوری.",
};

type Highlight = { icon: AboutIconName; title: string; subtitle: string };

const storyHighlights: Highlight[] = [
  { icon: "coins", title: "قیمت مناسب", subtitle: "حذف واسطه‌ها" },
  { icon: "cart", title: "خرید آسان", subtitle: "در چند دقیقه" },
  { icon: "truck", title: "ارسال سریع", subtitle: "به سراسر کشور" },
  { icon: "shield", title: "اصالت کالا", subtitle: "از برندهای معتبر" },
];

const stats: Highlight[] = [
  { icon: "doc", title: "۵۰۰۰+", subtitle: "سفارش موفق" },
  { icon: "box", title: "۳۰۰+", subtitle: "محصول متنوع" },
  { icon: "truck", title: "ارسال به سراسر کشور", subtitle: "سریع و مطمئن" },
  { icon: "headset", title: "پشتیبانی تخصصی", subtitle: "همیشه در کنار شما" },
  { icon: "diamond", title: "قیمت رقابتی", subtitle: "حذف واسطه‌ها" },
];

const values: { icon: AboutIconName; title: string; text: string }[] = [
  {
    icon: "coins",
    title: "قیمت منصفانه",
    text: "حذف واسطه‌ها و دسترسی مستقیم به تأمین‌کنندگان",
  },
  {
    icon: "shield",
    title: "اصالت کالا",
    text: "فقط از برندهای معتبر و باکیفیت",
  },
  { icon: "cart", title: "تجربه خرید آسان", text: "فرآیند ساده، سریع و مطمئن" },
  {
    icon: "code",
    title: "تمام نرم‌افزاری",
    text: "استفاده از فناوری برای ارائه خدمات بهتر",
  },
];

const teamPoints: Highlight[] = [
  {
    icon: "users",
    title: "تجربه بهتر خرید کاغذ",
    subtitle: "مأموریت همیشگی ما",
  },
  { icon: "headset", title: "پشتیبانی پاسخگو", subtitle: "راهنمایی تخصصی" },
  { icon: "growth", title: "بهبود مداوم", subtitle: "همراه با بازخوردهای شما" },
];

const ctaPoints = ["خرید مطمئن", "کیفیت تضمین‌شده", "همراه کسب‌وکارهای موفق"];

function HighlightItem({ item }: { item: Highlight }) {
  return (
    <div className="flex flex-col items-center gap-1.5 px-2 text-center sm:px-3">
      <AboutIcon name={item.icon} className="size-7 text-buttonGold" />
      <b className="text-[13px] font-black leading-6 text-navy sm:text-sm">
        {item.title}
      </b>
      <small className="text-[11px] font-semibold leading-5 text-muted sm:text-xs">
        {item.subtitle}
      </small>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="site-page space-y-5 sm:space-y-6">
        {/* داستان ما */}
        <section className="flex flex-col gap-6 rounded-[26px] border border-borderBlue/70 bg-white p-5 shadow-card lg:flex-row  lg:items-center lg:gap-10 lg:p-8">
          <div>
            <p className="text-xs font-black text-buttonGold sm:text-sm">
              داستان ما
            </p>
            <h1 className="mt-3 text-2xl font-black leading-[1.8] text-navy sm:text-3xl lg:text-[32px]">
              چطور کاغذ را ارزان‌تر و هوشمندتر می‌رسانیم
            </h1>
            <p className="mt-4 text-sm font-semibold leading-8 text-muted sm:text-[15px]">
              کاغذ ۲۰ حاصل تلاش یک تیم حرفه‌ای است که با استفاده از فناوری، خرید
              کاغذ را ساده‌تر، سریع‌تر و مقرون‌به‌صرفه‌تر کرده است. ما با حذف
              واسطه‌ها، کاغذ باکیفیت را به قیمتی منصفانه به دست شما می‌رسانیم.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-y-5 border-t border-borderBlue pt-5 sm:grid-cols-4 sm:divide-x sm:divide-x-reverse sm:divide-borderBlue">
              {storyHighlights.map((item) => (
                <HighlightItem item={item} key={item.title} />
              ))}
            </div>
          </div>

          <div className="w-full relative order-first aspect-[4/3] overflow-hidden rounded-2xl bg-softBlue lg:order-last lg:aspect-[5/4]">
            <Image
              alt="بسته‌های کاغذ کاغذ ۲۰"
              className="object-cover"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              src="/images/pages/about-story.webp"
            />
          </div>
        </section>

        {/* درباره ما */}
        <section className="grid gap-6 rounded-[26px] border border-borderBlue/70 bg-white p-5 shadow-card lg:grid-cols-2 lg:items-center lg:gap-10 lg:p-8">
          <div>
            <p className="text-xs font-black text-buttonGold sm:text-sm">
              درباره ما
            </p>
            <h2 className="mt-3 text-xl font-black leading-[1.8] text-navy sm:text-2xl lg:text-[28px]">
              از یک مسئله واقعی تا کاغذ ۲۰
            </h2>
            <div className="mt-4 space-y-3 text-sm font-semibold leading-8 text-muted sm:text-[15px]">
              <p>
                ما در کاغذ ۲۰ باور داریم که تهیه کاغذ نباید پیچیده و گران باشد.
              </p>
              <p>
                سال‌ها وجود واسطه‌ها در زنجیره تأمین باعث افزایش قیمت و دشواری
                دسترسی به کاغذ باکیفیت شده بود. به همین دلیل تیم ما تصمیم گرفت
                با تکیه بر دانش فنی، مسیری تازه بسازد: خرید مستقیم، شفاف و
                عادلانه برای همه.
              </p>
              <p>
                امروز کاغذ ۲۰ کنار شماست تا با حذف واسطه‌ها، کاغذ موردنیازتان را
                با بهترین قیمت و در کوتاه‌ترین زمان تهیه کنید.
              </p>
            </div>
          </div>

          <div className="relative order-first aspect-[4/3] overflow-hidden rounded-2xl bg-softBlue lg:aspect-[5/4]">
            <Image
              alt="انبار کاغذ ۲۰"
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              src="/images/pages/about-warehouse.webp"
            />
          </div>
        </section>

        {/* آمار */}
        <section className="grid grid-cols-2 gap-y-6 rounded-[26px] border border-borderBlue/70 bg-white p-6 shadow-card sm:grid-cols-3 sm:divide-x sm:divide-x-reverse sm:divide-borderBlue lg:grid-cols-5 lg:p-7">
          {stats.map((item) => (
            <HighlightItem item={item} key={item.subtitle} />
          ))}
        </section>

        {/* ارزش‌های ما */}
        <section>
          <div className="text-center">
            <h2 className="text-xl font-black text-navy sm:text-2xl">
              ارزش‌های ما
            </h2>
            <span className="mx-auto mt-2 block h-[3px] w-14 rounded-full bg-buttonGold" />
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <article
                className="rounded-2xl border border-borderBlue/70 bg-white p-5 text-center shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-card"
                key={value.title}
              >
                <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-softBlue text-buttonGold">
                  <AboutIcon name={value.icon} className="size-6" />
                </span>
                <h3 className="mt-3 text-sm font-black text-navy sm:text-base">
                  {value.title}
                </h3>
                <p className="mt-2 text-xs font-semibold leading-6 text-muted sm:text-[13px]">
                  {value.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* تیم نرم‌افزاری */}
        <section className="rounded-[26px] border border-borderBlue/70 bg-white p-5 shadow-card lg:p-8">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-10">
            <div>
              <h2 className="text-xl font-black leading-[1.8] text-navy sm:text-2xl lg:text-[28px]">
                یک تیم نرم‌افزاری پشت کاغذ ۲۰
              </h2>
              <p className="mt-4 text-sm font-semibold leading-8 text-muted sm:text-[15px]">
                کاغذ ۲۰ توسط یک تیم متخصص و علاقه‌مند به فناوری ساخته شده است.
                ما با توسعه راهکارهای نرم‌افزاری، زنجیره تأمین را هوشمندتر کرده
                و تجربه خرید بهتری برای شما فراهم می‌کنیم. هدف ما استفاده از
                تکنولوژی برای ایجاد شفافیت، بهینه‌سازی فرآیندها و ارائه خدماتی
                در بالاترین سطح است.
              </p>
            </div>

            <div className="relative order-first aspect-[4/3] overflow-hidden rounded-2xl bg-softBlue lg:order-last lg:aspect-[5/4]">
              <Image
                alt="تیم نرم‌افزاری کاغذ ۲۰"
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                src="/images/pages/about-team.webp"
              />
            </div>
          </div>

          <div className="mx-auto relative z-10 mt-5 grid grid-cols-1 gap-y-5 rounded-2xl border border-borderBlue/70 bg-page p-5 sm:grid-cols-3 sm:divide-x sm:divide-x-reverse sm:divide-borderBlue lg:w-[78%] lg:bg-white lg:shadow-premium">
            {teamPoints.map((item) => (
              <HighlightItem item={item} key={item.title} />
            ))}
          </div>
        </section>

        {/* بنر پایانی */}
        <section className="overflow-hidden rounded-[26px] bg-[linear-gradient(270deg,#001b55_0%,#062a72_55%,#0a3a9a_100%)] p-6 text-white shadow-premium sm:p-8">
          <div className="flex flex-col items-center gap-5 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_200px] lg:items-center lg:gap-8">
            <Link
              className="order-3 flex h-12 min-w-[200px] items-center justify-center gap-2 rounded-xl bg-buttonGold px-6 font-black text-navy transition hover:bg-[#d99b27] lg:order-none"
              href="/shop"
            >
              مشاهده محصولات
              <span aria-hidden="true">‹</span>
            </Link>

            <div className="order-2 text-center lg:order-none lg:text-right">
              <h2 className="text-xl font-black sm:text-2xl">
                با kaghaz هوشمندتر خرید کنید
              </h2>
              <p className="mt-2 text-xs font-semibold text-white/80 sm:text-sm">
                کاغذ باکیفیت، قیمت منصفانه، ارسال سریع
              </p>
            </div>

            <div className="relative order-1 h-32 w-44 shrink-0 lg:order-none lg:h-36 lg:w-full">
              <Image
                alt="کاغذ Double A"
                className="object-fill"
                fill
                sizes="200px"
                src="/images/double-a-uploaded.png"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-white/15 pt-4 text-xs font-bold sm:text-sm">
            {ctaPoints.map((point) => (
              <span className="flex items-center gap-2" key={point}>
                <AboutIcon name="check" className="size-4 text-buttonGold" />
                {point}
              </span>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
