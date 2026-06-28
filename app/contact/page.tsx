import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageIcon } from "@/components/pages/PageIcon";
import { StandardHero } from "@/components/ui/StandardHero";

export default function ContactPage(){return <><Header/><main className="site-page contact-page">
  <section><StandardHero src="/images/pages/contact-hero.png" alt="تماس با ما" imageClassName="!object-cover object-[58%_center] lg:object-center" frameClassName="h-[220px] sm:h-[300px] lg:h-[400px]" /></section>
  <div className="contact-columns">
    <section className="contact-info panel"><div className="contact-details">{[["ساعات کاری","شنبه تا پنجشنبه، ۸ تا ۱۸","clock"],["آدرس دفتر مرکزی","تهران، خیابان ولیعصر، نبش شهید بهشتی","pin"],["ایمیل","info@kaghaz20.com","mail"],["تماس تلفنی","۰۲۱-۹۱۰۰-۷۰۷۰","phone"]].map(x=><div key={x[0]}><PageIcon name={x[2]}/><span><b>{x[0]}</b><small>{x[1]}</small></span></div>)}</div><div className="map"><Image src="/images/pages/contact-map.png" alt="موقعیت دفتر کاغذ ۲۰" fill sizes="70vw"/></div><h3>دفتر مرکزی Double A ایران</h3><p>تهران، خیابان ولیعصر، بالاتر از میدان مهران، نبش خیابان شهید بهشتی، پلاک ۲۰۰</p></section>
    <section className="contact-form panel"><h1>برای ما پیام بگذارید</h1><p>فرم زیر را تکمیل کنید تا در اسرع وقت با شما تماس بگیریم.</p><form><div className="field-row"><input placeholder="نام و نام خانوادگی"/><input type="email" placeholder="ایمیل"/></div><div className="field-row"><input placeholder="شماره موبایل"/><select defaultValue=""><option value="" disabled>موضوع</option><option>مشاوره خرید</option><option>پشتیبانی</option></select></div><textarea placeholder="پیام شما"/><button>ارسال پیام　⌁</button></form><small>معمولاً در کمتر از ۲ ساعت پاسخ می‌دهیم.</small></section>
  </div>
  </main><Footer/></>}
