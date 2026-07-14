function normalizeApiUrl(value: string): string {
  const url = new URL(value);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("PAPER_API_URL must use http or https.");
  }

  return url.toString().replace(/\/$/, "");
}

export function getApiUrl(): string {
  const value = process.env.PAPER_API_URL?.trim();

  if (!value) {
    throw new Error("PAPER_API_URL is not configured.");
  }

  return normalizeApiUrl(value);
}
