import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageIcon } from "@/components/pages/PageIcon";
import { StandardHero } from "@/components/ui/StandardHero";

// Office location; coordinates come from the Neshan place link.
const mapEmbed = "https://www.openstreetmap.org/export/embed.html?bbox=51.431%2C35.759%2C51.443%2C35.765&layer=mapnik&marker=35.762%2C51.437";
const mapLinks = [
  ["نشان", "https://neshan.org/maps/places/dde99bf27901e4e5bb7064e78ed399cc#c35.762-51.437-16z-0p"],
  ["بلد", "https://balad.ir/location?latitude=35.762&longitude=51.437&zoom=16"],
  ["گوگل مپ", "https://www.google.com/maps/search/?api=1&query=35.762,51.437"],
];

export default function ContactPage(){return <><Header/><main className="site-page contact-page">
  <section><StandardHero src="/images/pages/contact-hero.webp" alt="تماس با ما" imageClassName="object-[58%_center] lg:object-center" /></section>
  <div className="contact-columns">
    <section className="contact-info panel"><div className="contact-details">{[["ساعات کاری","شنبه تا پنجشنبه، ۸ تا ۱۸","clock"],["آدرس شرکت","تهران، بلوار میرداماد، خیابان کازرون شمالی، خیابان نیک‌رای، پلاک ۲، طبقه سوم، واحد ۶","pin"],["ایمیل","info@kaghaz20.ir","mail"],["تماس تلفنی","۰۹۱۲۰۲۴۱۱۷۸","phone"]].map(x=><div key={x[0]}><PageIcon name={x[2]}/><span><b>{x[0]}</b><small>{x[1]}</small></span></div>)}</div><div className="map"><iframe src={mapEmbed} title="موقعیت شرکت کاغذ ۲۰ روی نقشه" loading="lazy"/></div><h3>شرکت کاغذ ۲۰</h3><p>تهران، بلوار میرداماد، خیابان کازرون شمالی، خیابان نیک‌رای، پلاک ۲، طبقه سوم، واحد ۶</p><div className="map-links">{mapLinks.map(([label,href])=><a key={label} href={href} target="_blank" rel="noopener noreferrer">مسیریابی با {label}</a>)}</div></section>
    <section className="contact-form panel"><h1>برای ما پیام بگذارید</h1><p>فرم زیر را تکمیل کنید تا در اسرع وقت با شما تماس بگیریم.</p><form><div className="field-row"><input placeholder="نام و نام خانوادگی"/><input type="email" placeholder="ایمیل"/></div><div className="field-row"><input placeholder="شماره موبایل"/><select defaultValue=""><option value="" disabled>موضوع</option><option>مشاوره خرید</option><option>پشتیبانی</option></select></div><textarea placeholder="پیام شما"/><button>ارسال پیام　⌁</button></form><small>معمولاً در کمتر از ۲ ساعت پاسخ می‌دهیم.</small></section>
  </div>
  </main><Footer/></>}
