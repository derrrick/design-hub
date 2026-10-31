import type { Metadata } from "next";

import { FeedList } from "@/components/feed-list";
import { PreviousList } from "@/components/previous-list";
import { ResourceBrowser } from "@/components/resource-browser";
import { formatDayYear, formatThoughtDate } from "@/lib/format";
import { getCategories, getEarlierDays, getLatestReading, getResources } from "@/lib/hub";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Resources",
  description: "Today’s reading, earlier days, and a shelf of resources kept from X.",
};

export default async function ResourcesPage() {
  const [categories, resources, reading, earlier] = await Promise.all([
    getCategories(),
    getResources(),
    getLatestReading(),
    getEarlierDays(),
  ]);

  return (
    <>
      <h1>Resources</h1>
      {reading.date ? (
        <section className="reading" aria-labelledby="reading-heading">
          <h2 id="reading-heading">
            <time dateTime={reading.date}>{formatThoughtDate(reading.date)}</time>
          </h2>
          {!reading.isToday ? (
            <p className="empty">Nothing new yet today. Showing the latest reading.</p>
          ) : null}
          <FeedList posts={reading.posts} label={`Posts for ${formatDayYear(reading.date)}`} />
        </section>
      ) : (
        <p className="empty">Nothing filed yet. The morning reading lands around 6am PT.</p>
      )}
      <PreviousList
        items={earlier.map((day) => ({
          href: `/resources/${day.date}`,
          label: formatThoughtDate(day.date),
        }))}
      />
      <section className="shelf">
        <h2>Shelf</h2>
        <ResourceBrowser categories={categories} resources={resources} />
      </section>
    </>
  );
}
