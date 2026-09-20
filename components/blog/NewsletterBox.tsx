export function NewsletterBox() {
  return (
    <section className="mt-8 rounded-xl bg-navy p-6 text-center text-white shadow-card">
      <h2 className="text-2xl font-black">از جدیدترین تخفیف‌ها باخبر شوید</h2>
      <div className="mx-auto mt-5 flex max-w-xl flex-col gap-3 sm:flex-row">
        <input className="h-11 flex-1 rounded-lg px-4 text-center text-navy outline-none" placeholder="ایمیل خود را وارد کنید ..." />
        <button className="h-11 rounded-lg bg-buttonGold px-10 font-black text-white" type="button">عضویت</button>
      </div>
    </section>
  );
}
