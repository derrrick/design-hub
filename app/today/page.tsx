import type { Metadata } from "next";
import Link from "next/link";

import { ExternalLink } from "@/components/external-link";
import { FeedList } from "@/components/feed-list";
import { formatDay, formatDayYear } from "@/lib/format";
import { getLatestReading } from "@/lib/hub";
import { site } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Today",
  description: site.description,
};

export default async function TodayPage() {
  const reading = await getLatestReading();

  return (
    <>
      <p className="intro">
        The morning file. About twenty posts, landed around 6am PT, on where the work seems to be
        heading. The page refreshes every hour, and again after that run. The note is{" "}
        <Link href="/" className="text-link">
          Design thoughts
        </Link>
        . The shelf is separate. For the sabbatical, before the{" "}
        <ExternalLink href={site.personalSite} className="text-link">
          personal site
        </ExternalLink>{" "}
        and the deck get rebuilt.
      </p>
      <h1>
        Today{" "}
        {reading.date ? (
          <time className="mono date" dateTime={reading.date}>
            {formatDay(reading.date)}
          </time>
        ) : null}
      </h1>
      {!reading.date ? (
        <p className="empty">Nothing filed yet. The morning reading lands around 6am PT.</p>
      ) : (
        <>
          {!reading.isToday ? (
            <p className="empty">Nothing new yet today. Showing the latest reading.</p>
          ) : null}
          <FeedList posts={reading.posts} label={`Posts for ${formatDayYear(reading.date)}`} />
          <p className="more">
            <Link href="/archive" className="text-link">
              Earlier
            </Link>
          </p>
        </>
      )}
    </>
  );
}
