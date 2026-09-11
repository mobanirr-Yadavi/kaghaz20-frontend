import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";

// Self-hosted page-view analytics. Counts live in memory and are saved to a JSON
// file (VISITS_FILE, default .data/visits.json) on this single Next.js server.
// Visitors are a random cookie id, stored only as a short hash; no IPs are kept.

export type VisitDay = { date: string; views: number; visitors: number };
export type VisitStats = {
  today: VisitDay;
  yesterday: VisitDay;
  last30: { views: number; visitors: number };
  total: number;
  online: number;
  daily: VisitDay[];
  topPages: { path: string; views: number }[];
  since: string | null;
};

type StoredDay = { views: number; visitors: string[]; paths: Record<string, number> };
type Store = { total: number; since: string | null; days: Record<string, StoredDay> };

const FILE = process.env.VISITS_FILE || path.join(process.cwd(), ".data", "visits.json");
const KEEP_DAYS = 90;
const MAX_PATHS_PER_DAY = 500;
const ONLINE_WINDOW_MS = 2 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

let store: Store | null = null;
let loading: Promise<Store> | null = null;
let saveTimer: ReturnType<typeof setTimeout> | null = null;
const visitorSets = new Map<string, Set<string>>(); // per day, for O(1) "seen today?" checks
const online = new Map<string, number>(); // visitor hash -> last activity

// Calendar day in Iran time, e.g. "2026-09-11".
export const dayKey = (time = Date.now()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tehran", year: "numeric", month: "2-digit", day: "2-digit" }).format(time);

const emptyStore = (): Store => ({ total: 0, since: null, days: {} });

async function readStore(): Promise<Store> {
  try {
    const parsed = JSON.parse(await fs.readFile(FILE, "utf8")) as Partial<Store>;
    if (!parsed || typeof parsed.days !== "object" || parsed.days === null) throw new Error("invalid visits file");
    return { total: parsed.total ?? 0, since: parsed.since ?? null, days: parsed.days };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      // Keep an unreadable file for inspection instead of overwriting it.
      console.error("[visits] could not read", FILE, error);
      await fs.rename(FILE, `${FILE}.broken-${Date.now()}`).catch(() => {});
    }
    return emptyStore();
  }
}

function loadStore(): Promise<Store> {
  if (store) return Promise.resolve(store);
  loading ??= readStore().then((loaded) => (store = loaded));
  return loading;
}

async function writeStore() {
  if (!store) return;
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(store));
  await fs.rename(tmp, FILE);
}

function scheduleSave() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    writeStore().catch((error) => console.error("[visits] save failed", error));
  }, 3000);
}

function prune(s: Store) {
  const cutoff = dayKey(Date.now() - KEEP_DAYS * DAY_MS);
  for (const key of Object.keys(s.days)) {
    if (key < cutoff) {
      delete s.days[key];
      visitorSets.delete(key);
    }
  }
}

export async function recordVisit(visitorId: string, pagePath: string, kind: "view" | "ping") {
  const id = createHash("sha256").update(visitorId).digest("base64url").slice(0, 12);
  online.set(id, Date.now());
  if (kind === "ping") return;

  const s = await loadStore();
  const key = dayKey();
  const day = (s.days[key] ??= { views: 0, visitors: [], paths: {} });

  let seen = visitorSets.get(key);
  if (!seen) {
    seen = new Set(day.visitors);
    visitorSets.set(key, seen);
  }
  if (!seen.has(id)) {
    seen.add(id);
    day.visitors.push(id);
  }

  day.views += 1;
  if (Object.hasOwn(day.paths, pagePath) || Object.keys(day.paths).length < MAX_PATHS_PER_DAY) {
    day.paths[pagePath] = (day.paths[pagePath] ?? 0) + 1;
  }
  s.total += 1;
  s.since ??= key;

  prune(s);
  scheduleSave();
}

export async function getVisitStats(): Promise<VisitStats> {
  const s = await loadStore();
  const now = Date.now();

  for (const [id, seenAt] of online) {
    if (now - seenAt > ONLINE_WINDOW_MS) online.delete(id);
  }

  // Last 30 Iran-time days, oldest first, including days with no visits.
  const keys = [...new Set(Array.from({ length: 30 }, (_, i) => dayKey(now - (29 - i) * DAY_MS)))];
  const daily = keys.map((date) => ({ date, views: s.days[date]?.views ?? 0, visitors: s.days[date]?.visitors.length ?? 0 }));

  const visitors = new Set<string>();
  const pages: Record<string, number> = {};
  for (const date of keys) {
    const day = s.days[date];
    if (!day) continue;
    day.visitors.forEach((id) => visitors.add(id));
    for (const [page, views] of Object.entries(day.paths)) pages[page] = (pages[page] ?? 0) + views;
  }

  const blank = (date: string): VisitDay => ({ date, views: 0, visitors: 0 });

  return {
    today: daily.at(-1) ?? blank(dayKey(now)),
    yesterday: daily.at(-2) ?? blank(dayKey(now - DAY_MS)),
    last30: { views: daily.reduce((sum, day) => sum + day.views, 0), visitors: visitors.size },
    total: s.total,
    online: online.size,
    daily,
    topPages: Object.entries(pages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([page, views]) => ({ path: page, views })),
    since: s.since,
  };
}
