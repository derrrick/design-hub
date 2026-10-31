import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const THOUGHTS = path.join(ROOT, "content", "thoughts");
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kfchwbwiqjykontpstgz.supabase.co";
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_a8aSc4A3BEkCUZgzf1KT3g_HglIDi94";

const FEEDS = [
  "https://www.lukew.com/ff/rss.xml",
  "https://www.nngroup.com/feed/rss/",
  "https://www.smashingmagazine.com/feed/",
];

const BANNED = [
  "excited",
  "thrilled",
  "landscape",
  "delve",
  "unlock",
  "empower",
  "robust",
  "leverage",
  "game-changer",
  "game changer",
  "tapestry",
  "it's worth noting",
  "it is worth noting",
  "in conclusion",
  "the future is bright",
];

const LINK = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;

function todayInPT(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function shiftIso(iso, days) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function hourInPT(now = new Date()) {
  const hour = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "2-digit",
    hourCycle: "h23",
  })
    .formatToParts(now)
    .find((part) => part.type === "hour");
  return Number(hour?.value ?? "0");
}

function pacificOffset(iso) {
  const probe = new Date(`${iso}T20:00:00Z`);
  const named = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    timeZoneName: "longOffset",
  }).format(probe);
  return named.match(/GMT([+-]\d{2}:\d{2})/)?.[1] ?? "-08:00";
}

function decode(value) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(xml, name) {
  const match = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return match ? match[1].trim() : "";
}

function rssItems(xml) {
  return xml
    .split(/<item[\s>]/i)
    .slice(1)
    .flatMap((chunk) => {
      const body = chunk.split(/<\/item>/i)[0] ?? "";
      const title = decode(tag(body, "title"));
      const link = decode(tag(body, "link"));
      const description = decode(tag(body, "description")).slice(0, 400);
      const pubDate = tag(body, "pubDate");
      const when = pubDate ? new Date(pubDate) : null;
      if (!title || !/^https?:\/\//.test(link)) return [];
      return [{ title, link: stripTracking(link), description, when }];
    });
}

function plain(markdown) {
  return markdown.replace(LINK, "$1").replace(/\s+/g, " ").trim();
}

function words(markdown) {
  const text = plain(markdown);
  return text ? text.split(/\s+/).length : 0;
}

export function parseParagraph(markdown) {
  const spans = [];
  let last = 0;
  for (const match of markdown.matchAll(LINK)) {
    const index = match.index ?? 0;
    if (index > last) spans.push({ text: markdown.slice(last, index) });
    spans.push({ text: match[1], href: match[2] });
    last = index + match[0].length;
  }
  if (last < markdown.length) spans.push({ text: markdown.slice(last) });
  return spans.filter((span) => span.text.length > 0);
}

function stripTracking(value) {
  try {
    const url = new URL(value);
    for (const key of [...url.searchParams.keys()]) {
      if (key.startsWith("utm_") || key === "ref") url.searchParams.delete(key);
    }
    return url.toString();
  } catch {
    return value;
  }
}

function normalizeUrl(value) {
  try {
    const url = new URL(value);
    url.hash = "";
    const pathName = url.pathname.replace(/\/$/, "") || "/";
    return `${url.protocol}//${url.hostname.toLowerCase()}${pathName}${url.search}`;
  } catch {
    return value;
  }
}

export function assess(paragraphs, allow) {
  if (paragraphs.length !== 3) return `expected 3 paragraphs, got ${paragraphs.length}`;
  const allowed = new Set(allow.map(normalizeUrl));
  const lowered = paragraphs.join("\n").toLowerCase();
  const banned = BANNED.find((phrase) => lowered.includes(phrase));
  if (banned) return `banned phrase: ${banned}`;
  let links = 0;
  for (const paragraph of paragraphs) {
    const count = words(paragraph);
    if (count < 55 || count > 130) return `paragraph is ${count} words`;
    for (const match of paragraph.matchAll(LINK)) {
      links += 1;
      if (!allowed.has(normalizeUrl(match[2]))) return `link is not in the source material: ${match[2]}`;
    }
  }
  if (links < 4) return `only ${links} citations`;
  return null;
}

async function getText(url, ms = 12000) {
  const response = await fetch(url, {
    headers: { "user-agent": "design-hub", accept: "text/html,application/xml,application/rss+xml,application/json" },
    signal: AbortSignal.timeout(ms),
    redirect: "follow",
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

async function supabaseGet(query) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${query}`, {
    headers: {
      apikey: SUPABASE_KEY,
      authorization: `Bearer ${SUPABASE_KEY}`,
      accept: "application/json",
    },
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

async function sourceDay(issueDate) {
  const yesterday = shiftIso(issueDate, -1);
  const direct = await supabaseGet(
    `hub_feed_posts?select=feed_date&feed_date=eq.${yesterday}&limit=1`,
  );
  if (direct.length > 0) return yesterday;
  const earlier = await supabaseGet(
    `hub_feed_posts?select=feed_date&feed_date=lt.${issueDate}&order=feed_date.desc&limit=1`,
  );
  return earlier[0]?.feed_date ?? null;
}

async function postsFor(date) {
  return supabaseGet(
    `hub_feed_posts?select=author_name,text,post_url,like_count,topic,links&feed_date=eq.${date}&order=like_count.desc&limit=20`,
  );
}

async function bookmarksFor(date) {
  const offset = pacificOffset(date);
  const next = shiftIso(date, 1);
  const start = encodeURIComponent(`${date}T00:00:00${offset}`);
  const end = encodeURIComponent(`${next}T00:00:00${offset}`);
  const rows = await supabaseGet(
    `hub_resources?select=title,url,author_handle,note&created_at=gte.${start}&created_at=lt.${end}&order=created_at.asc&limit=20`,
  );
  return rows.length > 0 && rows.length <= 12 ? rows : [];
}

function onSubject(value) {
  return /\b(design|designer|figma|typography|ux|interface)\b/i.test(value) && !/^show hn:/i.test(value);
}

function clip(value, max) {
  const clean = String(value ?? "").replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max).trimEnd()}…`;
}

async function searchWeb() {
  const query = "product design AI";
  const weekAgo = Math.floor(Date.now() / 1000) - 14 * 24 * 60 * 60;
  const found = [];

  try {
    const payload = await getText(
      `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=12&numericFilters=created_at_i>${weekAgo}`,
    );
    const hits = JSON.parse(payload).hits ?? [];
    for (const hit of hits) {
      const link = hit.url || (hit.objectID ? `https://news.ycombinator.com/item?id=${hit.objectID}` : "");
      const title = hit.title || "Hacker News";
      if (!/^https?:\/\//.test(link) || !onSubject(title)) continue;
      found.push({ title, link, description: clip(hit.story_text || "", 280) });
    }
  } catch (error) {
    console.error("HN search failed:", error instanceof Error ? error.message : error);
  }

  const cutoff = Date.now() - 21 * 24 * 60 * 60 * 1000;
  for (const feed of FEEDS) {
    try {
      const xml = await getText(feed);
      let kept = 0;
      for (const item of rssItems(xml)) {
        if (kept >= 2) break;
        if (item.when && item.when.getTime() < cutoff) continue;
        found.push(item);
        kept += 1;
      }
    } catch (error) {
      console.error(`Feed failed ${feed}:`, error instanceof Error ? error.message : error);
    }
  }

  const ranked = [
    ...found.filter((item) => !item.link.includes("news.ycombinator.com")),
    ...found.filter((item) => item.link.includes("news.ycombinator.com")),
  ];
  const seen = new Set();
  const unique = [];
  for (const item of ranked) {
    const key = normalizeUrl(item.link);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
    if (unique.length === 6) break;
  }

  const reading = [];
  for (const item of unique) {
    if (reading.length >= 3) break;
    const host = new URL(item.link).hostname;
    if (/(^|\.)((x|twitter|news\.ycombinator)\.com)$/.test(host)) continue;
    try {
      const html = await getText(item.link, 8000);
      const text = decode(html).slice(0, 1600);
      if (text.length > 200) reading.push({ ...item, text });
    } catch {
      reading.push(item);
    }
  }
  return { query, results: unique, reading };
}

function previousNote() {
  if (!existsSync(THOUGHTS)) return "";
  const files = readdirSync(THOUGHTS)
    .filter((name) => name.endsWith(".json"))
    .sort();
  const latest = files.at(-1);
  if (!latest) return "";
  try {
    const thought = JSON.parse(readFileSync(path.join(THOUGHTS, latest), "utf8"));
    return (thought.paragraphs ?? [])
      .map((paragraph) => paragraph.map((span) => span.text).join(""))
      .join("\n\n");
  } catch {
    return "";
  }
}

function materialText({ issueDate, sourceDate, posts, bookmarks, web }) {
  const postLines = posts.map((post) => {
    const links = Array.isArray(post.links) ? post.links.filter((link) => /^https?:\/\//.test(link)) : [];
    return `- ${post.author_name || "Unknown"} (${post.like_count ?? 0} likes, ${post.topic || "untagged"})\n  ${post.post_url}\n  ${clip(post.text, 420)}${links.length ? `\n  links: ${links.join(" ")}` : ""}`;
  });
  const bookmarkLines = bookmarks.map(
    (row) => `- ${row.title} ${row.url}${row.note ? `\n  ${clip(row.note, 200)}` : ""}`,
  );
  const webLines = web.reading.map(
    (item) => `- ${item.title}\n  ${item.link}\n  ${clip(item.text || item.description, 900)}`,
  );
  const tone = previousNote();
  return [
    `Issue date: ${issueDate}`,
    `Source day: ${sourceDate}`,
    "",
    "Posts from that day's X file, most likes first:",
    postLines.join("\n") || "(none)",
    "",
    "Bookmarks saved that day:",
    bookmarkLines.join("\n") || "(none)",
    "",
    `Web search for “${web.query}”, then the pages that would open:`,
    webLines.join("\n\n") || "(none)",
    "",
    tone
      ? `Tone of the previous note, for temperament only. Do not reuse its sentences, and do not cite it unless the URL is also in the material above:\n${tone}`
      : "",
  ]
    .join("\n");
}

function allowlist({ posts, bookmarks, web }) {
  const urls = [];
  for (const post of posts) {
    if (post.post_url) urls.push(post.post_url);
    if (Array.isArray(post.links)) urls.push(...post.links);
  }
  for (const row of bookmarks) if (row.url) urls.push(row.url);
  for (const item of web.results) urls.push(item.link);
  for (const item of web.reading) urls.push(item.link);
  return urls.filter((url) => /^https?:\/\//.test(url));
}

const SYSTEM = `You write Design thoughts, a daily note on a personal site about product design.

Write exactly three paragraphs of plain prose, separated by one blank line. No title, no date, no sign-off, no bullets.

Take a position. The file is mostly people announcing things. Say so when that is what the material shows. The interesting question is what the work is becoming, including what is being refused, deleted, or left unsaid. Do not encourage the reader. Do not balance every point with a compliment. Do not write as if the industry is on a wholesome journey.

Each paragraph is 60 to 110 words. Use markdown links, [Name](url), for the people and pieces you actually rely on. At least four links. Copy every URL from the material. If a detail is not in the material, leave it out. Do not invent quotes.

Do not use I. Do not write as Derrick.

Do not use: excited, thrilled, landscape, delve, unlock, empower, robust, leverage, game-changer, tapestry, "it's worth noting", "in conclusion", "the future is bright".

Return only the three paragraphs.`;

async function complete(user) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is missing. The daily job runs in GitHub Actions, which provides one.");
  const models = [process.env.THOUGHT_MODEL, "openai/gpt-4.1-mini", "openai/gpt-4o-mini"].filter(Boolean);
  let lastError = "no model response";
  for (const model of [...new Set(models)]) {
    const response = await fetch("https://models.github.ai/inference/chat/completions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        accept: "application/vnd.github+json",
        "content-type": "application/json",
        "x-github-api-version": "2022-11-28",
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: user },
        ],
      }),
      signal: AbortSignal.timeout(45000),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      lastError = `${model}: ${response.status} ${JSON.stringify(payload).slice(0, 300)}`;
      continue;
    }
    const content = payload.choices?.[0]?.message?.content;
    const text = Array.isArray(content) ? content.map((part) => part.text || "").join("") : String(content ?? "");
    if (text.trim()) return text.trim();
    lastError = `${model}: empty completion`;
  }
  throw new Error(lastError);
}

function splitParagraphs(text) {
  return text
    .replace(/^```(?:markdown|md|text)?\s*/i, "")
    .replace(/\s*```$/, "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

async function draft(user, allow) {
  let note = user;
  let reason = "no draft";
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const text = await complete(note);
    const paragraphs = splitParagraphs(text);
    reason = assess(paragraphs, allow);
    if (!reason) return paragraphs;
    note = `${user}\n\nThe previous draft was rejected: ${reason}. Write it again.`;
  }
  throw new Error(reason);
}

function writeThought(issueDate, paragraphs) {
  mkdirSync(THOUGHTS, { recursive: true });
  const file = path.join(THOUGHTS, `${issueDate}.json`);
  const body = {
    date: issueDate,
    paragraphs: paragraphs.map(parseParagraph),
  };
  writeFileSync(file, `${JSON.stringify(body, null, 2)}\n`);
  return file;
}

async function main() {
  const args = new Set(process.argv.slice(2));
  if (args.has("--self-test")) {
    const sample = "One claim. [Luke](https://www.lukew.com/ff/entry.asp?2164) said it.";
    const spans = parseParagraph(sample);
    if (spans.length !== 3 || spans[1].href !== "https://www.lukew.com/ff/entry.asp?2164") {
      throw new Error("parser failed");
    }
    const bad = assess(["hi", "there", "friend"], []);
    if (!bad) throw new Error("assess should reject a short draft");
    if (hourInPT(new Date()) < 0 || hourInPT(new Date()) > 23) throw new Error("hour out of range");
    console.log("self-test ok");
    return;
  }

  const force = args.has("--force") || process.env.FORCE === "1";
  const dry = args.has("--dry-run");
  if (!force && !dry && hourInPT() !== 3) {
    console.log("Not 3:00am Pacific. Skipping.");
    return;
  }

  const issueDate = dry && process.env.ISSUE_DATE ? process.env.ISSUE_DATE : todayInPT();
  const file = path.join(THOUGHTS, `${issueDate}.json`);
  if (existsSync(file) && !dry) {
    console.log(`${issueDate} already published.`);
    return;
  }

  const sourceDate = await sourceDay(issueDate);
  if (!sourceDate) {
    console.log("No earlier X file to write from.");
    return;
  }
  const [posts, bookmarks] = await Promise.all([postsFor(sourceDate), bookmarksFor(sourceDate)]);
  if (posts.length === 0) {
    console.log(`No posts for ${sourceDate}.`);
    return;
  }
  const web = await searchWeb();
  const packed = { issueDate, sourceDate, posts, bookmarks, web };
  const user = materialText(packed);
  const allow = allowlist(packed);
  console.log(
    `Issue ${issueDate} from ${sourceDate}: ${posts.length} posts, ${bookmarks.length} bookmarks, ${web.results.length} search results.`,
  );
  for (const item of web.results) console.log(`  - ${item.title} <${item.link}>`);
  if (dry) {
    console.log(user.slice(0, 1500));
    return;
  }

  const paragraphs = await draft(user, allow);
  const written = writeThought(issueDate, paragraphs);
  console.log(`Wrote ${path.relative(ROOT, written)}`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
