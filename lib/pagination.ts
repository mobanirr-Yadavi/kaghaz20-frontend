// Shape of every *Paged / Search endpoint's `data`. The backend currently sends the keys
// in lowercase (pagenumber, totalpages, ...), so normalizePaged accepts both spellings.
export type PagedResult<T> = {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export const PRODUCTS_PAGE_SIZE = 12;
export const ORDERS_PAGE_SIZE = 10;

export type RawPaged<T> = Partial<PagedResult<T>> & {
  pagenumber?: number;
  pagesize?: number;
  totalcount?: number;
  totalpages?: number;
};

export function normalizePaged<T, R = T>(raw: RawPaged<T> | null | undefined, map?: (item: T) => R): PagedResult<R> {
  const items = Array.isArray(raw?.items) ? raw.items : [];
  return {
    items: map ? items.map(map) : (items as unknown as R[]),
    pageNumber: Number(raw?.pageNumber ?? raw?.pagenumber ?? 1),
    pageSize: Number(raw?.pageSize ?? raw?.pagesize ?? items.length),
    totalCount: Number(raw?.totalCount ?? raw?.totalcount ?? items.length),
    totalPages: Number(raw?.totalPages ?? raw?.totalpages ?? 0),
  };
}

// "?pageNumber=2&pageSize=12&search=..." — empty filter values are left out.
export function pagedQuery(pageNumber: number, pageSize: number, filters: Record<string, string | undefined> = {}) {
  const params = new URLSearchParams({ pageNumber: String(pageNumber), pageSize: String(pageSize) });
  for (const [key, value] of Object.entries(filters)) if (value) params.set(key, value);
  return `?${params}`;
}

// Same shape for a list that is already in memory (used while admin order filters are
// active, because the paged endpoint has no filter parameters).
export function paginateLocally<T>(items: T[], pageNumber: number, pageSize: number): PagedResult<T> {
  const totalPages = Math.ceil(items.length / pageSize);
  return {
    items: items.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
    pageNumber,
    pageSize,
    totalCount: items.length,
    totalPages,
  };
}
