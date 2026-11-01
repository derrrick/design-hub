import "server-only";

import { cache } from "react";

import {
  articleLink,
  calendarInPT,
  displayHandle,
  excerpt,
  profileUrl,
  safeHttpUrl,
  todayInPT,
  xPostDate,
} from "@/lib/format";
import { getSupabase } from "@/lib/supabase";
import type { Category, FeedDay, FeedPost, LatestReading, Resource } from "@/lib/types";

const FEED_COLUMNS =
  "id, post_url, author_handle, author_name, text, posted_at, topic, relevance_note, like_count, repost_count, reply_count, links, feed_date";

type CategoryRow = {
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
};

type ResourceRow = {
  title: string;
  url: string;
  x_post_url: string | null;
  author_handle: string | null;
  category_slug: string;
  tags: string[] | null;
  note: string | null;
  featured: boolean | null;
};

type FeedRow = {
  id: string;
  post_url: string;
  author_handle: string | null;
  author_name: string | null;
  text: string | null;
  posted_at: string;
  topic: string | null;
  relevance_note: string | null;
  like_count: number | null;
  repost_count: number | null;
  reply_count: number | null;
  links: string[] | null;
  feed_date: string;
};

type DateRow = {
  id: string;
  feed_date: string;
};

function fail(table: string, message: string): never {
  throw new Error(`Could not read ${table}: ${message}`);
}

function numberOrZero(value: number | null): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function toFeedPost(row: FeedRow): FeedPost | null {
  const postUrl = safeHttpUrl(row.post_url);
  if (!postUrl || !row.feed_date) return null;
  const handle = displayHandle(row.author_handle);
  return {
    id: row.id,
    postUrl,
    authorName: row.author_name?.trim() || handle || "Unknown",
    authorHandle: handle,
    profileUrl: profileUrl(row.author_handle),
    excerpt: excerpt(row.text),
    topic: row.topic?.trim() || null,
    note: row.relevance_note?.trim() || null,
    likes: numberOrZero(row.like_count),
    reposts: numberOrZero(row.repost_count),
    replies: numberOrZero(row.reply_count),
    article: articleLink(row.links),
    postedAt: row.posted_at,
    postedOn: calendarInPT(row.posted_at),
    feedDate: row.feed_date,
  };
}

export const getCategories = cache(async (): Promise<Category[]> => {
  const { data, error } = await getSupabase()
    .from("hub_categories")
    .select("slug, name, description, sort_order")
    .order("sort_order", { ascending: true })
    .limit(100)
    .returns<CategoryRow[]>();

  if (error) fail("hub_categories", error.message);

  return (data ?? []).map((row) => ({
    slug: row.slug,
    name: row.name,
    description: row.description?.trim() || null,
    sortOrder: row.sort_order,
  }));
});

export const getResources = cache(async (): Promise<Resource[]> => {
  const { data, error } = await getSupabase()
    .from("hub_resources")
    .select("title, url, x_post_url, author_handle, category_slug, tags, note, featured")
    .order("title", { ascending: true })
    .limit(1000)
    .returns<ResourceRow[]>();

  if (error) fail("hub_resources", error.message);

  return (data ?? []).flatMap((row) => {
    const url = safeHttpUrl(row.url);
    if (!url || !row.category_slug || !row.title) return [];
    return [
      {
        title: row.title.trim(),
        url,
        xPostUrl: safeHttpUrl(row.x_post_url),
        authorHandle: displayHandle(row.author_handle),
        profileUrl: profileUrl(row.author_handle),
        categorySlug: row.category_slug,
        tags: (row.tags ?? []).filter((tag) => typeof tag === "string"),
        note: row.note?.trim() ?? "",
        featured: Boolean(row.featured),
        postedOn: xPostDate(row.x_post_url) ?? xPostDate(row.url),
      },
    ];
  });
});

export const getDateCounts = cache(async (): Promise<FeedDay[]> => {
  const supabase = getSupabase();
  const counts = new Map<string, number>();
  const pageSize = 1000;

  for (let from = 0; from < 20000; from += pageSize) {
    const { data, error } = await supabase
      .from("hub_feed_posts")
      .select("id, feed_date")
      .order("feed_date", { ascending: false })
      .order("id", { ascending: false })
      .range(from, from + pageSize - 1)
      .returns<DateRow[]>();

    if (error) fail("hub_feed_posts", error.message);

    const rows = data ?? [];
    for (const row of rows) {
      if (!row.feed_date) continue;
      counts.set(row.feed_date, (counts.get(row.feed_date) ?? 0) + 1);
    }
    if (rows.length < pageSize) break;
  }

  return [...counts.entries()].map(([date, count]) => ({ date, count }));
});

export const getPostsForDate = cache(async (date: string): Promise<FeedPost[]> => {
  const { data, error } = await getSupabase()
    .from("hub_feed_posts")
    .select(FEED_COLUMNS)
    .eq("feed_date", date)
    .order("posted_at", { ascending: false })
    .limit(100)
    .returns<FeedRow[]>();

  if (error) fail("hub_feed_posts", error.message);
  return (data ?? []).flatMap((row) => {
    const post = toFeedPost(row);
    return post ? [post] : [];
  });
});

export const getLatestReading = cache(async (): Promise<LatestReading> => {
  const days = await getDateCounts();
  const latest = days[0];
  if (!latest) {
    return { date: null, isToday: false, posts: [], earlierDays: 0 };
  }
  const posts = await getPostsForDate(latest.date);
  return {
    date: latest.date,
    isToday: latest.date === todayInPT(),
    posts,
    earlierDays: Math.max(days.length - 1, 0),
  };
});

export const getEarlierDays = cache(async (): Promise<FeedDay[]> => {
  const days = await getDateCounts();
  return days.slice(1);
});

export const getRecentPosts = cache(async (limit = 40): Promise<FeedPost[]> => {
  const { data, error } = await getSupabase()
    .from("hub_feed_posts")
    .select(FEED_COLUMNS)
    .order("posted_at", { ascending: false })
    .limit(limit)
    .returns<FeedRow[]>();

  if (error) fail("hub_feed_posts", error.message);
  return (data ?? []).flatMap((row) => {
    const post = toFeedPost(row);
    return post ? [post] : [];
  });
});
