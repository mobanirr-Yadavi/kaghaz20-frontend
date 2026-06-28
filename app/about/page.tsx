import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { PageIcon } from "@/components/pages/PageIcon";
import { Footer } from "@/components/layout/Footer";
import { StandardHero } from "@/components/ui/StandardHero";

const values = [
  ["اعتماد و تعهد", "ساختن روابط بلندمدت و شفافیت در تمامی تعاملات و پشتیبانی برتر", "people"],
  ["نوآوری مستمر", "سرمایه‌گذاری در تحقیق و توسعه برای ارائه محصولات بهتر و هوشمندتر", "idea"],
  ["پایداری محیط زیست", "استفاده مسئولانه از منابع طبیعی و تولید محصولات دوستدار محیط زیست", "leaf"],
  ["کیفیت بی‌نظیر", "متعهد به تولید کاغذی با بهترین استانداردهای کیفیت برای بهترین تجربه کاربری", "shield"],
];
const history = [["۱۹۹۱","تأسیس شرکت"],["۱۹۹۶","گسترش تولید"],["۲۰۰۶","ورود به بازار جهانی"],["۲۰۱۵","نوآوری پایدار"],["۲۰۲۴","رهبری جهانی"]];

export default function AboutPage() {
  return <><Header /><main className="site-page about-page">
    <section><StandardHero src="/images/pages/about-hero.png" alt="درباره کاغذ ۲۰ و محصولات Double A" imageClassName="!object-cover object-[52%_center] lg:object-center" /></section>
    <section className="about-story panel">
      <div className="story-image"><Image src="/images/pages/about-building.png" alt="ساختمان دابل ای" fill sizes="(max-width: 800px) 100vw, 35vw"/><span><b>بیش از ۳۰ سال</b> تجربه در تولید کاغذ با کیفیت</span></div>
      <div className="story-copy"><p className="eyebrow">درباره ما</p><h1>از یک رویا تا برندی جهانی</h1><p>در سال ۱۹۹۱ در تایلند تأسیس شد با هدف تولید کاغذ با کیفیت بالا که نیازهای حرفه‌ای کاربران را برآورده کند. امروز ما نه تنها محصولاتی با کیفیت را در بیش از ۱۰۰ کشور عرضه می‌کنیم، بلکه میلیون‌ها کاربر به کیفیت و عملکرد ما اعتماد دارند.</p><p>ما در کاغذ Double A باور داریم که کیفیت، پایداری و نوآوری سه اصل اساسی در هر کسب‌وکار موفق هستند.</p>
        <div className="history">{history.map((x,i)=><div key={x[0]}><PageIcon name={i===2?'globe':i===4?'award':'factory'}/><b>{x[0]}</b><strong>{x[1]}</strong><small>{i===0?'شروع فعالیت با یک چشم‌انداز بزرگ':i===4?'حضور در میان برترین برندهای کاغذ':'رشد پایدار و اعتماد جهانی'}</small></div>)}</div>
      </div>
      <h2 className="section-label">ارزش‌های ما</h2>
      <div className="value-grid">{values.map(v=><article key={v[0]}><PageIcon name={v[2]}/><h3>{v[0]}</h3><p>{v[1]}</p></article>)}</div>
      <div className="about-numbers"><div className="number-copy"><h2>Double A در یک نگاه</h2><div>{[["۳۰+","سال تجربه"],["۶","کارخانه پیشرفته"],["۲M+","مشتری راضی"],["۱۰۰+","کشور"]].map(x=><span key={x[0]}><b>{x[0]}</b><small>{x[1]}</small></span>)}</div></div><div className="factory-image"><Image src="/images/pages/about-factory.png" alt="کارخانه دابل ای" fill sizes="50vw"/><p><b>تولید با استانداردهای جهانی</b><br/>تکنولوژی‌های پیشرفته و رعایت دقیق استانداردها در هر مرحله تولید</p></div></div>
    </section>
    <Link href="/shop" className="about-cta"><Image src="/images/pages/about-cta.png" alt="تجربه کیفیت متفاوت با دابل ای" fill sizes="100vw"/><span>مشاهده محصولات</span></Link>
  </main><Footer /></>;
}
