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
  "this file",
  "this pass",
  "with a knife",
  "a costume of",
  "one could argue",
  "it seems",
  "sort of",
  "kind of",
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

function weekdayInPT(now = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
  }).format(now);
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

function sentences(paragraph) {
  return plain(paragraph)
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function numberedLines(paragraph) {
  const lines = paragraph
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2 || !lines.every((line) => /^\d+\.\s+\S/.test(line))) return null;
  return lines;
}

export function assess(paragraphs, allow) {
  if (paragraphs.length < 3) return `expected an opening line, a body, and a takeaway, got ${paragraphs.length} blocks`;
  const allowed = new Set(allow.map(normalizeUrl));
  const lowered = paragraphs.join("\n").toLowerCase();
  const banned = BANNED.find((phrase) => lowered.includes(phrase));
  if (banned) return `banned phrase: ${banned}`;

  const total = words(paragraphs.join(" "));
  if (total < 100 || total > 180) return `note is ${total} words`;

  const first = plain(paragraphs[0]);
  if (numberedLines(paragraphs[0]) || sentences(paragraphs[0]).length !== 1) {
    return "the first line must be one sentence";
  }
  if (first.length > 90) return "the first line is too long for the list";

  const last = paragraphs[paragraphs.length - 1];
  if (last.includes("\n") || words(last) > 14) return "end on one short line";

  let links = 0;
  for (const paragraph of paragraphs) {
    const list = numberedLines(paragraph);
    if (list) {
      if (list.length > 3) return "a numbered list is only for two or three options";
    } else if (paragraph !== paragraphs[0] && paragraph !== last) {
      const count = sentences(paragraph).length;
      if (count < 1 || count > 3) return `a paragraph is ${count} sentences`;
    }
    for (const match of paragraph.matchAll(LINK)) {
      links += 1;
      if (!allowed.has(normalizeUrl(match[2]))) return `link is not in the source material: ${match[2]}`;
    }
  }
  if (links < 1) return "cite at least one source";
  if (links > 5) return `cite at most 5 sources, got ${links}`;
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

async function postsForWeek(issueDate) {
  const start = shiftIso(issueDate, -7);
  return supabaseGet(
    `hub_feed_posts?select=feed_date,author_name,text,post_url,like_count,topic,links&feed_date=gte.${start}&feed_date=lt.${issueDate}&order=like_count.desc&limit=80`,
  );
}

async function bookmarksForWeek(issueDate) {
  const startDay = shiftIso(issueDate, -7);
  const start = encodeURIComponent(`${startDay}T00:00:00${pacificOffset(startDay)}`);
  const end = encodeURIComponent(`${issueDate}T00:00:00${pacificOffset(issueDate)}`);
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

function materialText({ issueDate, posts, bookmarks, web }) {
  const postLines = posts.map((post) => {
    const links = Array.isArray(post.links) ? post.links.filter((link) => /^https?:\/\//.test(link)) : [];
    return `- ${post.feed_date || "undated"} · ${post.author_name || "Unknown"} (${post.like_count ?? 0} likes, ${post.topic || "untagged"})\n  ${post.post_url}\n  ${clip(post.text, 420)}${links.length ? `\n  links: ${links.join(" ")}` : ""}`;
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
    "",
    "Posts from the previous 7 days, most likes first:",
    postLines.join("\n") || "(none)",
    "",
    "Bookmarks saved during those 7 days:",
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

const SYSTEM = `You write Design thoughts, a weekly note on a personal site about product design.

Write the way Cory Etzkorn writes a short essay: one opinion, stated first, then the shortest path to it. Plain words. Short declarative sentences. No hedging and no throat-clearing.

Shape, with a blank line between blocks:
- The first block is one sentence. It is the point of view. The home page list shows this sentence, so keep it under 90 characters.
- Then short paragraphs of one to three sentences.
- A numbered list only when you are genuinely naming two or three options. Put the items in one block, one per line, starting at "1. ". Otherwise no bullets and no headings.
- The last block is one line, the takeaway. Two short sentences on that line are fine, as in "Build less. Mean more."

The whole note is 100 to 180 words.

First person is fine. Do not mention this file, this pass, the prompt, or that you are summarizing a feed. Do not write a literary flourish. Never write "with a knife in it" or "a costume of".

Link a name inline as [Name](url). Cite at most 5 sources, and only the ones that support the argument. Do not summarize everything you were given. Copy every URL from the material. If a detail is not in the material, leave it out. Do not invent quotes.

Do not use: excited, thrilled, landscape, delve, unlock, empower, robust, leverage, game-changer, tapestry, "it's worth noting", "in conclusion", "the future is bright", "one could argue", "it seems", "sort of", "kind of".

Return only the note.`;

async function complete(user) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is missing. The weekly job runs in GitHub Actions, which provides one.");
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
    .trim()
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/[ \t]*\n[ \t]*/g, "\n").replace(/[ \t]{2,}/g, " ").trim())
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
    const luke = "https://www.lukew.com/ff/entry.asp?2164";
    const good = [
      "Design's job right now is refusal.",
      `[Luke Wroblewski](${luke}) put it simply. There are two ways to make money in software, bundling and unbundling. AI is speed-running the bundling.`,
      "A feature can work and still make the product worse. Add enough of them and the product is an average. You cannot feel anyone behind it.",
      "Someone has to decide what stays. Agents will follow a written rule. They will not know when the rule is wrong.",
      "The font that traveled is not the lesson. The lesson is what shipped beside it. Attention is not a brief.",
      "Refusal is the work.",
      "Build less. Mean more.",
    ];
    const goodReason = assess(good, [luke]);
    if (goodReason) throw new Error(`assess rejected a good draft: ${goodReason}`);
    const extra = good[2].replace(/\.$/, " [A](https://example.com/a) [B](https://example.com/b) [C](https://example.com/c) [D](https://example.com/d) [E](https://example.com/e).");
    const crowded = assess([...good.slice(0, 2), extra, ...good.slice(3)], [luke, "https://example.com/a", "https://example.com/b", "https://example.com/c", "https://example.com/d", "https://example.com/e"]);
    if (!crowded || !crowded.includes("at most 5")) throw new Error(`assess should cap citations, got ${crowded}`);
    if (hourInPT(new Date()) < 0 || hourInPT(new Date()) > 23) throw new Error("hour out of range");
    if (!/^(Sun|Mon|Tue|Wed|Thu|Fri|Sat)$/.test(weekdayInPT(new Date()))) throw new Error("weekday out of range");
    console.log("self-test ok");
    return;
  }

  const force = args.has("--force") || process.env.FORCE === "1";
  const dry = args.has("--dry-run");
  if (!force && !dry && (weekdayInPT() !== "Mon" || hourInPT() !== 7)) {
    console.log("Not Monday 7:00am Pacific. Skipping.");
    return;
  }

  const issueDate = dry && process.env.ISSUE_DATE ? process.env.ISSUE_DATE : todayInPT();
  const file = path.join(THOUGHTS, `${issueDate}.json`);
  if (existsSync(file) && !dry) {
    console.log(`${issueDate} already published.`);
    return;
  }

  const [posts, bookmarks] = await Promise.all([postsForWeek(issueDate), bookmarksForWeek(issueDate)]);
  if (posts.length === 0) {
    console.log("No posts in the previous 7 days.");
    return;
  }
  const web = await searchWeb();
  const packed = { issueDate, posts, bookmarks, web };
  const user = materialText(packed);
  const allow = allowlist(packed);
  console.log(
    `Issue ${issueDate} from the previous 7 days: ${posts.length} posts, ${bookmarks.length} bookmarks, ${web.results.length} search results.`,
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
