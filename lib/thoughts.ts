import "server-only";

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { safeHttpUrl, todayInPT } from "@/lib/format";

export type ThoughtSpan = {
  text: string;
  href?: string;
};

export type Thought = {
  date: string;
  paragraphs: ThoughtSpan[][];
};

function thoughtDir(): string {
  return path.join(process.cwd(), "content", "thoughts");
}

function readThought(file: string): Thought | null {
  try {
    const raw = JSON.parse(readFileSync(file, "utf8")) as {
      date?: unknown;
      paragraphs?: unknown;
    };
    if (typeof raw.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(raw.date)) return null;
    if (!Array.isArray(raw.paragraphs) || raw.paragraphs.length === 0) return null;
    const paragraphs = raw.paragraphs.flatMap((paragraph) => {
      if (!Array.isArray(paragraph)) return [];
      const spans = paragraph.flatMap((span) => {
        if (!span || typeof span !== "object") return [];
        const text = "text" in span && typeof span.text === "string" ? span.text : "";
        if (!text) return [];
        const href = "href" in span && typeof span.href === "string" ? safeHttpUrl(span.href) : null;
        return [href ? { text, href } : { text }];
      });
      return spans.length > 0 ? [spans] : [];
    });
    if (paragraphs.length === 0) return null;
    return { date: raw.date, paragraphs };
  } catch {
    return null;
  }
}

export function listThoughts(now = new Date()): Thought[] {
  const today = todayInPT(now);
  let files: string[] = [];
  try {
    files = readdirSync(thoughtDir()).filter((name) => name.endsWith(".json"));
  } catch {
    return [];
  }

  return files
    .map((name) => readThought(path.join(thoughtDir(), name)))
    .filter((thought): thought is Thought => thought !== null && thought.date <= today)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getLatestThought(now = new Date()): Thought | null {
  return listThoughts(now)[0] ?? null;
}

export function getThought(date: string, now = new Date()): Thought | null {
  return listThoughts(now).find((thought) => thought.date === date) ?? null;
}
