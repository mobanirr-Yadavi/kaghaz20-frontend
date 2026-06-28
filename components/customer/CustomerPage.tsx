import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export type CustomerSection = { icon: string; title: string; text: string; points?: string[] };
export function CustomerPage({ eyebrow, title, description, icon, sections, children }: { eyebrow: string; title: string; description: string; icon: string; sections: CustomerSection[]; children?: React.ReactNode }) {
  return <><Header /><main className="customer-page">
    <section className="customer-hero"><div className="customer-hero-pattern" aria-hidden="true" /><div className="customer-hero-icon" aria-hidden="true">{icon}</div><div className="customer-hero-copy"><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p><div className="customer-breadcrumb"><Link href="/">خانه</Link><b>←</b><span>{title}</span></div></div></section>
    <div className="customer-content">{children}<section className="customer-grid">{sections.map((section) => <article key={section.title}><i aria-hidden="true">{section.icon}</i><h2>{section.title}</h2><p>{section.text}</p>{section.points && <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul>}</article>)}</section>
    <aside className="customer-help"><div><b>هنوز سوالی دارید؟</b><span>کارشناسان کاغذ ۲۰ آماده راهنمایی شما هستند.</span></div><Link href="/contact">تماس با پشتیبانی</Link></aside></div>
  </main><Footer /></>;
}
