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
    <footer className="mt-2 bg-[linear-gradient(90deg,#001247,#001B55)] py-6 text-white">
      <Container>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.35fr_.7fr_.8fr_1fr_1fr] lg:gap-10">
          <div>
            <h3 className="mb-4 text-sm font-black">نمادها و مجوزها</h3>
            <div className="max-w-[430px]">
              <Image
                alt="نمادها و مجوزهای کاغذ ۲۰"
                className="h-auto w-full object-contain"
                height={86}
                sizes="(max-width: 1024px) 90vw, 410px"
                src="/images/footer-license-icons/licenses-strip.png"
                width={407}
              />
            </div>
          </div>
          <FooterList title="دسترسی سریع" items={quickLinks} />
          <FooterList title="خدمات مشتریان" items={customerLinks} />
          <div>
            <h3 className="mb-4 text-sm font-black">
              درباره <span className="text-buttonGold">کاغذ 20</span>
            </h3>
            <p className="max-w-[250px] text-xs font-semibold leading-7 text-white/78">
              مرکز تخصصی فروش کاغذ Double A با ضمانت اصالت، کیفیت و خدمات پس از فروش حرفه‌ای
            </p>
            <Link className="mt-4 inline-block text-sm font-black text-buttonGold" href="/about">
              بیشتر درباره ما ←
            </Link>
          </div>
          <div>
            <div className="mb-4 inline-flex rounded-xl bg-white px-3 py-2 shadow-soft">
              <Image alt="کاغذ ۲۰" className="h-auto w-[118px]" height={72} src="/images/logo-kaghaz20.png" width={150} />
            </div>
            <ul className="space-y-2 text-xs font-semibold text-white/82">
              <li dir="ltr" className="text-right">09382302930</li>
              <li>info@kaghaz20.ir</li>
              <li className="leading-6">تهران، بلوار میرداماد، خیابان کازرون شمالی، خیابان نیک‌رای، پلاک ۲، طبقه سوم، واحد ۶</li>
            </ul>
            <div className="mt-4 flex gap-2">
              <a aria-label="ارسال ایمیل" className="grid size-8 place-items-center rounded-full bg-white/12 text-xs font-black transition hover:bg-buttonGold hover:text-navy" href="mailto:info@kaghaz20.ir">@</a>
              <a aria-label="تماس تلفنی" className="grid size-8 place-items-center rounded-full bg-white/12 text-xs font-black transition hover:bg-buttonGold hover:text-navy" href="tel:+989382302930">☎</a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
