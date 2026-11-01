const HANDLE = /^[A-Za-z0-9_]{1,15}$/;

const STATUS_HOSTS = new Set(["x.com", "twitter.com", "t.co"]);

export function safeHttpUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function profileUrl(handle: string | null | undefined): string | null {
  const clean = handle?.replace(/^@/, "").trim();
  if (!clean || !HANDLE.test(clean)) return null;
  return `https://x.com/${clean}`;
}

export function displayHandle(handle: string | null | undefined): string {
  const clean = handle?.replace(/^@/, "").trim();
  return clean ? `@${clean}` : "";
}

function isStatusHost(hostname: string): boolean {
  const host = hostname.replace(/^www\./, "").toLowerCase();
  return STATUS_HOSTS.has(host) || host.endsWith(".x.com") || host.endsWith(".twitter.com");
}

export function articleLink(links: string[] | null | undefined): { href: string; label: string } | null {
  if (!links) return null;
  for (const value of links) {
    const href = safeHttpUrl(value);
    if (!href) continue;
    const url = new URL(href);
    if (isStatusHost(url.hostname)) continue;
    return { href, label: url.hostname.replace(/^www\./, "") };
  }
  return null;
}

const TCO = /https?:\/\/t\.co\/\S+/gi;

export function excerpt(text: string | null | undefined, max = 180): string {
  const clean = (text ?? "")
    .replace(TCO, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!clean) return "";
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed = (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trimEnd();
  return `${trimmed.replace(/[.,;:]+$/, "")}…`;
}

export function parseDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function isIsoDate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function todayInPT(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

const SNOWFLAKE_EPOCH = BigInt("1288834974657");

export function calendarInPT(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const iso = todayInPT(date);
  return isIsoDate(iso) ? iso : null;
}

// Bookmark rows share one import timestamp. The post date is the X status id.
export function xPostDate(value: string | null | undefined): string | null {
  const href = safeHttpUrl(value);
  if (!href) return null;
  let id: string | undefined;
  try {
    const url = new URL(href);
    if (!isStatusHost(url.hostname)) return null;
    id = url.pathname.match(/\/status\/(\d+)/)?.[1];
  } catch {
    return null;
  }
  if (!id) return null;
  let ms: number;
  try {
    ms = Number((BigInt(id) >> BigInt(22)) + SNOWFLAKE_EPOCH);
  } catch {
    return null;
  }
  if (!Number.isSafeInteger(ms)) return null;
  return calendarInPT(new Date(ms).toISOString());
}

export function formatThoughtDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(parseDate(iso));
}

export function formatDay(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(parseDate(iso));
}

export function formatDayYear(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parseDate(iso));
}

export function postCount(count: number): string {
  return `${count} ${count === 1 ? "post" : "posts"}`;
}

export function metric(count: number, singular: string, plural: string): string | null {
  if (count <= 0) return null;
  return `${count.toLocaleString("en-US")} ${count === 1 ? singular : plural}`;
}

export function rfc822(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return new Date(0).toUTCString();
  return date.toUTCString();
}

export function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
