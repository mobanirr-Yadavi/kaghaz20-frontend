import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";

const links = [
  ["فروشگاه", "مشاهده و خرید محصولات", "/store", "♧"],
  ["خرید عمده و سازمانی", "خرید ویژه شرکت‌ها و سازمان‌ها", "/shop", "▦"],
  ["مجله", "مطالعه مقالات و اخبار", "/blog", "▤"],
  ["تماس با ما", "پشتیبانی و راهنمایی", "/contact", "♧"],
  ["درباره ما", "با ما بیشتر آشنا شوید", "/about", "♙"],
];

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="notfound-page">
        <Container>
          <section className="notfound-hero">
            <div className="notfound-art"><Image src="/images/pages/notfound-visual.png" alt="صفحه پیدا نشد" fill priority sizes="(max-width: 900px) 100vw, 55vw" /></div>
            <div className="notfound-copy">
              <div className="error-code">4<span>0</span>4</div>
              <h1>صفحه مورد نظر یافت نشد!</h1>
              <p>متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا ممکن است آدرس آن تغییر کرده باشد.</p>
              <Link className="primary-action" href="/">بازگشت به صفحه اصلی</Link>
              <Link className="secondary-action" href="/store">مشاهده محصولات</Link>
            </div>
          </section>
          <h2 className="useful-title">شاید این صفحات برای شما مفید باشد</h2>
          <section className="useful-grid">
            {links.map(([title, text, href, icon]) => <Link href={href} key={title}><i>{icon}</i><b>{title}</b><span>{text}</span><em>←</em></Link>)}
          </section>
          <section className="notfound-search">
            <Image src="/images/pages/notfound-search.png" alt="جستجو" width={230} height={180} />
            <div><h2>هنوز چیزی پیدا نکردید؟</h2><p>از جستجوی زیر برای یافتن محصول یا مقاله مورد نظر خود استفاده کنید.</p><form action="/store"><input name="q" placeholder="جستجو در محصولات، مقالات و مطالب ..." /><button>جستجو ←</button></form></div>
          </section>
        </Container>
      </main>
      <Footer />
    </>
  );
}
