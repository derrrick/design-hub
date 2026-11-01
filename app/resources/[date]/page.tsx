import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackLink } from "@/components/back-link";
import { FeedList } from "@/components/feed-list";
import { PreviousList } from "@/components/previous-list";
import { formatDayYear, formatThoughtDate, isIsoDate } from "@/lib/format";
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
  if (!isIsoDate(date)) return { title: "Posts" };
  return {
    title: formatThoughtDate(date),
    description: `Product design reading for ${formatThoughtDate(date)}.`,
  };
}

export default async function ResourceDayPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  if (!isIsoDate(date)) notFound();

  const [posts, days] = await Promise.all([getPostsForDate(date), getDateCounts()]);
  if (posts.length === 0) notFound();

  const previous = days
    .filter((day) => day.date < date)
    .map((day) => ({ href: `/resources/${day.date}`, label: formatThoughtDate(day.date) }));

  return (
    <section className="band">
      <BackLink href="/#thoughts" />
      <h1 className="label follows">
        <time dateTime={date}>{formatThoughtDate(date)}</time>
      </h1>
      <div className="slot follows">
        <FeedList posts={posts} label={`Posts for ${formatDayYear(date)}`} />
      </div>
      <PreviousList id="day-previous" items={previous} />
    </section>
  );
}
