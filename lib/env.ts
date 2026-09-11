import { apiBaseUrl } from "@/lib/apiBase";

// Server-side base address of the API (same value the browser uses).
export function getApiUrl(): string {
  return apiBaseUrl();
}
