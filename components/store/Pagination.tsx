export function Pagination() {
  return (
    <div className="mt-6 flex justify-center gap-2">
      {["‹", "۱", "۲", "۳", "۴", "…", "۸", "›"].map((item) => (
        <button className={`grid size-9 place-items-center rounded-full border text-sm font-black ${item === "۱" ? "bg-navy text-white" : "border-borderBlue bg-white text-navy"}`} key={item} type="button">
          {item}
        </button>
      ))}
    </div>
  );
}
