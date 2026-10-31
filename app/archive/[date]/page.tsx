import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FeedList } from "@/components/feed-list";
import { formatDayYear, isIsoDate } from "@/lib/format";
import { getDateCounts, getPostsForDate } from "@/lib/hub";

export const revalidate = 3600;

export async function generateStaticParams() {
  const days = await getDateCounts();
  return days.map((day) => ({ date: day.date }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await params;
  if (!isIsoDate(date)) return { title: "Earlier" };
  return {
    title: formatDayYear(date),
    description: `Product design reading for ${formatDayYear(date)}.`,
  };
}

export default async function ArchiveDayPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  if (!isIsoDate(date)) notFound();

  const posts = await getPostsForDate(date);
  if (posts.length === 0) notFound();

  return (
    <>
      <p className="back">
        <Link href="/archive">Earlier</Link>
      </p>
      <h1>
        <time dateTime={date}>{formatDayYear(date)}</time>
      </h1>
      <FeedList posts={posts} label={`Posts for ${formatDayYear(date)}`} />
    </>
  );
}
