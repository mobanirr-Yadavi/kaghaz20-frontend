import { SearchIcon } from "@/components/ui/Icons";

export function SearchBar() {
  return (
    <form action="/shop" className="relative w-full" role="search">
      <input
        aria-label="جستجو"
        className="h-10 w-full rounded-full border border-transparent bg-[#F2F4F9] px-4 pl-10 text-right text-xs text-textNavy outline-none transition placeholder:text-[#8A93AA] focus:border-royal focus:bg-white sm:px-5 sm:pl-11"
        name="q"
        placeholder="جستجو در محصولات Double A ..."
        type="search"
      />
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-navy" />
    </form>
  );
}
