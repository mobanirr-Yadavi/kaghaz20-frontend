import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { customerLinks, quickLinks } from "@/data/footerLinks";

function FooterList({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-black text-white">{title}</h3>
      <ul className="space-y-2 text-xs font-semibold leading-6 text-white/78">
        {items.map((item) => (
          <li key={item.href}>
            <Link className="transition hover:text-buttonGold" href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-8 overflow-hidden border-t-4 border-buttonGold/80 bg-[radial-gradient(circle_at_15%_10%,rgba(7,88,190,.32),transparent_28%),linear-gradient(110deg,#00103d,#001B55_55%,#00276c)] py-9 text-white shadow-[0_-12px_36px_rgba(0,27,85,.08)] sm:py-11">
  <Container>
    <div className="grid gap-9 md:grid-cols-2 lg:grid-cols-[1.35fr_.7fr_.8fr_1fr_1fr] lg:gap-10">

      {/* نمادها و مجوزها */}
      <div>
        <h3 className="mb-4 text-sm font-black">نمادها و مجوزها</h3>

        <div className="flex max-w-[430px] flex-wrap items-center gap-4">
          

          {/* اینماد */}
          <a
            referrerPolicy="origin"
            target="_blank"
            rel="noopener noreferrer"
            href="https://trustseal.enamad.ir/?id=772087&Code=StpDXVmDaWBSZL5tmf0k2pFuDcsgJFsV"
            className="flex h-[100px] w-[100px] items-center justify-center rounded-xl bg-white p-2 shadow-soft transition hover:scale-105"
            aria-label="نماد اعتماد الکترونیکی"
          >
            <img
              referrerPolicy="origin"
              src="https://trustseal.enamad.ir/logo.aspx?id=772087&Code=StpDXVmDaWBSZL5tmf0k2pFuDcsgJFsV"
              alt="نماد اعتماد الکترونیکی"
              className="h-auto max-h-[85px] w-auto cursor-pointer object-contain"
              code="StpDXVmDaWBSZL5tmf0k2pFuDcsgJFsV"
            />
          </a>
        </div>
      </div>

      {/* دسترسی سریع */}
      <FooterList
        title="دسترسی سریع"
        items={quickLinks}
      />

      {/* خدمات مشتریان */}
      <FooterList
        title="خدمات مشتریان"
        items={customerLinks}
      />

      {/* درباره کاغذ 20 */}
      <div>
        <h3 className="mb-4 text-sm font-black">
          درباره <span className="text-buttonGold">کاغذ 20</span>
        </h3>

        <p className="max-w-[250px] text-xs font-semibold leading-7 text-white/78">
          مرکز تخصصی فروش کاغذ Double A با ضمانت اصالت، کیفیت و خدمات پس از
          فروش حرفه‌ای
        </p>

        <Link
          className="mt-4 inline-block text-sm font-black text-buttonGold"
          href="/about"
        >
          بیشتر درباره ما ←
        </Link>
      </div>

      {/* اطلاعات تماس */}
      <div>
        <div className="mb-4 inline-flex rounded-xl bg-white px-3 py-2 shadow-soft">
          <Image
            alt="کاغذ ۲۰"
            className="h-auto w-[118px]"
            height={72}
            src="/images/logo-kaghaz20.png"
            width={150}
          />
        </div>

        <ul className="space-y-2 text-xs font-semibold text-white/82">
          <li
            dir="ltr"
            className="text-right"
          >
            09382302930
          </li>

          <li>info@kaghaz20.ir</li>

          <li className="leading-6">
            تهران، بلوار میرداماد، خیابان کازرون شمالی، خیابان نیک‌رای،
            پلاک ۲، طبقه سوم، واحد ۶
          </li>
        </ul>

        <div className="mt-4 flex gap-2">
          <a
            aria-label="ارسال ایمیل"
            className="grid size-8 place-items-center rounded-full bg-white/12 text-xs font-black transition hover:bg-buttonGold hover:text-navy"
            href="mailto:info@kaghaz20.ir"
          >
            @
          </a>

          <a
            aria-label="تماس تلفنی"
            className="grid size-8 place-items-center rounded-full bg-white/12 text-xs font-black transition hover:bg-buttonGold hover:text-navy"
            href="tel:+989382302930"
          >
            ☎
          </a>
        </div>
      </div>

    </div>
  </Container>
</footer>
  );
}
