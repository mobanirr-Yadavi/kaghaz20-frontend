import type { Product } from "@/types/product";
import { sanitizeRichText } from "@/lib/sanitizeRichText";

export function ProductTabs({ product }: { product: Product }) {
  const description = sanitizeRichText(product.description);

  return (
    <section className="rounded-xl bg-white p-6 shadow-card">
      <div className="mb-5 grid grid-cols-2 gap-2 border-b border-borderBlue text-center text-sm font-black text-navy md:grid-cols-4">
        {["توضیحات محصول", "مشخصات فنی", "نظرات کاربران", "سوالات متداول"].map((tab, index) => (
          <span className={`pb-3 ${index === 0 ? "border-b-2 border-buttonGold" : ""}`} key={tab}>{tab}</span>
        ))}
      </div>
      <h2 className="font-black text-navy">توضیحات محصول</h2>
      {description ? (
        // Sanitized on the server: only the editor's formatting tags survive.
        <div className="rich-text mt-3 text-sm font-semibold leading-8 text-textNavy" dangerouslySetInnerHTML={{ __html: description }} />
      ) : (
        <p className="mt-3 text-sm font-semibold leading-8 text-muted">توضیحاتی برای این محصول ثبت نشده است.</p>
      )}
      <div className="mt-6 grid gap-3 md:grid-cols-4">
        {["سفیدی بالا CIE 170", "ضخامت یکنواخت", "استحکام بالا", "دوستدار محیط زیست"].map((item) => (
          <div className="rounded-lg bg-softBlue p-4 text-center text-sm font-black text-navy" key={item}>{item}</div>
        ))}
      </div>
    </section>
  );
}
