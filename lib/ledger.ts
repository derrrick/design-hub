import type { FeedPost } from "@/lib/types";

export function loudestPost(posts: FeedPost[]): FeedPost | null {
  if (posts.length === 0) return null;
  return [...posts].sort((a, b) => b.likes - a.likes || b.postedAt.localeCompare(a.postedAt))[0];
}

export function quietestPost(posts: FeedPost[]): FeedPost | null {
  if (posts.length === 0) return null;
  return [...posts].sort((a, b) => a.likes - b.likes || a.postedAt.localeCompare(b.postedAt))[0];
}

export function topicsInOrder(posts: FeedPost[]): { topic: string; posts: FeedPost[] }[] {
  const groups: { topic: string; posts: FeedPost[] }[] = [];
  const index = new Map<string, number>();
  for (const post of posts) {
    const topic = post.topic ?? "Untagged";
    const existing = index.get(topic);
    if (existing === undefined) {
      index.set(topic, groups.length);
      groups.push({ topic, posts: [post] });
    } else {
      groups[existing].posts.push(post);
    }
  }
  return groups;
}

export function topicShift(latest: FeedPost[], previous: FeedPost[]): { added: string[]; dropped: string[] } {
  const latestTopics = new Set(latest.flatMap((post) => (post.topic ? [post.topic] : [])));
  const previousTopics = new Set(previous.flatMap((post) => (post.topic ? [post.topic] : [])));
  const added = [...latestTopics].filter((topic) => !previousTopics.has(topic)).sort();
  const dropped = [...previousTopics].filter((topic) => !latestTopics.has(topic)).sort();
  return { added, dropped };
}

export function listTopics(topics: string[]): string {
  if (topics.length === 0) return "";
  if (topics.length === 1) return topics[0];
  if (topics.length === 2) return `${topics[0]} and ${topics[1]}`;
  return `${topics.slice(0, -1).join(", ")}, and ${topics[topics.length - 1]}`;
}
