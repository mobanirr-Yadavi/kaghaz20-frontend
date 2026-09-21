import { useEffect, useRef, useState } from "react";
import type { PagedResult } from "@/lib/pagination";

// Loads one page at a time. `queryKey` identifies the filters: when it changes the list
// goes back to page 1. `initial` is the server-rendered first result, so the first
// render needs no request. Nothing is loaded while `enabled` is false.
export function usePagedList<T>({
  queryKey,
  load,
  initial = null,
  enabled = true,
}: {
  queryKey: string;
  load: (pageNumber: number) => Promise<PagedResult<T>>;
  initial?: PagedResult<T> | null;
  enabled?: boolean;
}) {
  const [page, setPage] = useState(initial?.pageNumber ?? 1);
  const [data, setData] = useState<PagedResult<T> | null>(initial);
  const [loading, setLoading] = useState(enabled && !initial);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [activeKey, setActiveKey] = useState(queryKey);
  if (activeKey !== queryKey) {
    setActiveKey(queryKey);
    setPage(1);
  }

  const loadRef = useRef(load);
  useEffect(() => {
    loadRef.current = load;
  });
  // Which "filters#page#attempt" is already on screen; the server-rendered page counts.
  const shown = useRef(initial ? `${queryKey}#${initial.pageNumber}#0` : "");

  useEffect(() => {
    const request = `${activeKey}#${page}#${attempt}`;
    if (!enabled || shown.current === request) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    loadRef.current(page)
      .then((result) => {
        if (cancelled) return;
        // Rows were removed since the last visit and this page no longer exists.
        if (result.totalPages > 0 && page > result.totalPages) setPage(result.totalPages);
        else {
          shown.current = request;
          setData(result);
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled) setError(reason instanceof Error && reason.message ? reason.message : "دریافت اطلاعات انجام نشد.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, activeKey, page, attempt]);

  return { data, page, setPage, loading, error, retry: () => setAttempt((value) => value + 1) };
}
