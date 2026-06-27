export function BlogSidebar() {
  const cats = [["همه دسته‌ها", "24"], ["راهنما و آموزش", "8"], ["اخبار و رویدادها", "6"], ["معرفی محصولات", "5"], ["نکات خرید", "3"], ["مقالات تخصصی", "2"]];
  return (
    <aside className="space-y-5">
      <div className="rounded-xl bg-white p-6 shadow-card">
        <h2 className="mb-5 text-xl font-black text-navy">دسته‌بندی‌ها</h2>
        {cats.map(([name, count]) => (
          <div className="flex justify-between py-2 text-sm font-bold text-textNavy" key={name}><span>{name}</span><span>{count}</span></div>
        ))}
      </div>
      <div className="rounded-xl bg-navy p-6 text-center text-white shadow-card">
        <div className="text-3xl">✉</div>
        <h2 className="mt-3 text-lg font-black">خبرنامه کاغذ 20</h2>
        <p className="mt-2 text-sm leading-7 text-white/80">جدیدترین مقالات و تخفیف‌ها را دریافت کنید</p>
        <input className="mt-4 h-11 w-full rounded-lg px-4 text-center text-sm text-navy outline-none" placeholder="ایمیل خود را وارد کنید..." />
        <button className="mt-3 h-11 w-full rounded-lg bg-buttonGold font-black text-white" type="button">عضویت</button>
      </div>
    </aside>
  );
}
