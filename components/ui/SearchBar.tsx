import { SearchIcon } from "@/components/ui/Icons";

export function SearchBar() {
  return (
    <form action="/shop" className="relative w-full" role="search">
      <input
        aria-label="جستجوی محصولات"
        className="h-11 w-full rounded-full border border-borderBlue/60 bg-[#F4F6FB] px-4 pl-11 text-right text-[13px] font-semibold text-textNavy outline-none transition duration-200 placeholder:font-medium placeholder:text-[#8A93AA] hover:border-borderBlue focus:border-royal focus:bg-white focus:shadow-soft focus:ring-4 focus:ring-royal/10 sm:px-5 sm:pl-12 [&::-webkit-search-cancel-button]:appearance-none"
        name="search"
        placeholder="جستجوی کاغذ A4، A3، A5…"
        type="search"
      />
      <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-navy/70 sm:left-4" />
    </form>
  );
}
