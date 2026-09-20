export function BlogTabs() {
  return (
    <div className="scrollbar-hide flex gap-3 overflow-x-auto py-5">
      {["همه", "راهنما و آموزش", "اخبار و رویدادها", "معرفی محصولات", "نکات خرید", "مقالات تخصصی"].map((tab, index) => (
        <button className={`h-10 shrink-0 rounded-lg border px-5 text-sm font-bold ${index === 0 ? "border-navy bg-navy text-white" : "border-borderBlue bg-white text-navy"}`} key={tab} type="button">
          {tab}
        </button>
      ))}
    </div>
  );
}
