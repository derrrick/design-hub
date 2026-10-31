import type { Metadata } from "next";

import { HeadingEssay } from "@/components/heading-essay";
import { HeadingFile } from "@/components/heading-file";
import { HeadingLedger } from "@/components/heading-ledger";
import { formatDayYear } from "@/lib/format";
import { getDateCounts, getPostsForDate } from "@/lib/hub";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Where this is heading",
  description:
    "An argument about where product design is heading, read against the morning file and a few pieces outside it.",
};

export default async function HeadingPage() {
  const days = await getDateCounts();
  const latest = days[0] ?? null;
  const previous = days[1] ?? null;
  const [posts, earlierPosts] = await Promise.all([
    latest ? getPostsForDate(latest.date) : Promise.resolve([]),
    previous ? getPostsForDate(previous.date) : Promise.resolve([]),
  ]);
  const date = latest?.date ?? posts[0]?.feedDate ?? null;

  return (
    <article>
      <h1 className="piece-title">Where this is heading</h1>
      <p className="dek">
        {date ? <time dateTime={date}>{formatDayYear(date)}</time> : "No file yet"}
        <span className="sep"> · </span>
        argument, not a briefing
      </p>
      <HeadingLedger posts={posts} previous={earlierPosts} previousDate={previous?.date ?? null} />
      <HeadingEssay />
      <HeadingFile posts={posts} />
    </article>
  );
}
