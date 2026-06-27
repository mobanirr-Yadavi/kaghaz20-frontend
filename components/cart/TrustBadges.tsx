export function TrustBadges() {
  return (
    <section className="grid gap-3 rounded-xl bg-white p-5 text-center shadow-card sm:grid-cols-4">
      {["پشتیبانی تخصصی", "ضمانت اصالت کالا", "ارسال سریع و رایگان", "بازگشت و مرجوعی آسان"].map((item) => (
        <div className="border-borderBlue sm:border-l last:border-l-0" key={item}>
          <div className="text-3xl text-navy">◎</div>
          <p className="mt-2 text-xs font-black text-navy">{item}</p>
        </div>
      ))}
    </section>
  );
}
