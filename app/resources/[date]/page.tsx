import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BackLink, SiteFooter } from "@/components/back-link";
import { FeedList } from "@/components/feed-list";
import { formatDayYear, formatThoughtDate, isIsoDate } from "@/lib/format";
import { getDateCounts, getPostsForDate } from "@/lib/hub";

export const revalidate = 3600;

export async function generateStaticParams() {
  const days = await getDateCounts();
  return days.map((day) => ({ date: day.date }));
}

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }): Promise<Metadata> {
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

  const previous = days.filter((day) => day.date < date).slice(0, 5);

  return (
    <div className="page page--tight">
      <BackLink href="/#thoughts" />
      <section className="section">
        <h1 className="title">
          <time dateTime={date}>{formatDayYear(date)}</time>
        </h1>
        <FeedList posts={posts} label={`Posts for ${formatDayYear(date)}`} />
      </section>
      {previous.length > 0 ? (
        <section className="section" aria-labelledby="day-previous">
          <h2 id="day-previous" className="label">
            Previous
          </h2>
          <div className="rows">
            {previous.map((day) => (
              <Link key={day.date} href={`/resources/${day.date}`} className="row">
                <span>{formatDayYear(day.date)}</span>
                <span />
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      <SiteFooter />
    </div>
  );
}
