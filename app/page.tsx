import Link from "next/link";

import { AboutIntro } from "@/components/about-intro";
import { DesignThought } from "@/components/design-thought";
import { FeedList } from "@/components/feed-list";
import { PreviousList } from "@/components/previous-list";
import { ResourceBrowser } from "@/components/resource-browser";
import { WorkList } from "@/components/work-list";
import { formatDayYear, formatThoughtDate } from "@/lib/format";
import { getCategories, getEarlierDays, getLatestReading, getResources } from "@/lib/hub";
import { site } from "@/lib/site";
import { getLatestThought, listThoughts } from "@/lib/thoughts";
import { professional, sideProjects } from "@/lib/work";

export const revalidate = 3600;

export default async function HomePage() {
  const thought = getLatestThought();
  const earlierNotes = thought
    ? listThoughts()
        .filter((item) => item.date < thought.date)
        .map((item) => ({ href: `/thoughts/${item.date}`, label: formatThoughtDate(item.date) }))
    : [];

  const [categories, resources, reading, earlierDays] = await Promise.all([
    getCategories(),
    getResources(),
    getLatestReading(),
    getEarlierDays(),
  ]);

  return (
    <>
      <section className="band" id="bio">
        <p className="label">Bio</p>
        <div className="slot">
          <h1>
            <Link className="name" href="/">
              {site.name}
            </Link>
          </h1>
          <AboutIntro />
        </div>
      </section>

      <section className="band" id="work">
        <h2 className="label">Work</h2>
        <div className="slot" />
        <WorkList heading="Professional" items={professional} first />
        <WorkList heading="Side projects" items={sideProjects} />
      </section>

      <section className="band" id="thoughts">
        <h2 className="label">Thoughts</h2>
        {thought ? (
          <>
            <div className="slot" />
            <Link href={`/thoughts/${thought.date}`} className="label date-link follows">
              <time dateTime={thought.date}>{formatThoughtDate(thought.date)}</time>
            </Link>
            <div className="slot follows">
              <DesignThought thought={thought} />
            </div>
            <PreviousList id="thoughts-previous" items={earlierNotes} />
          </>
        ) : (
          <p className="slot empty">Nothing published yet. The note lands at 3am PT.</p>
        )}
      </section>

      <section className="band" id="resources">
        <h2 className="label">Resources</h2>
        <ResourceBrowser categories={categories} resources={resources} />
        {reading.date ? (
          <>
            <Link href={`/resources/${reading.date}`} className="label date-link subsection">
              <time dateTime={reading.date}>{formatThoughtDate(reading.date)}</time>
            </Link>
            <div className="slot subsection">
              {!reading.isToday ? (
                <p className="empty">Nothing new yet today. Showing the latest reading.</p>
              ) : null}
              <FeedList posts={reading.posts} label={`Posts for ${formatDayYear(reading.date)}`} />
            </div>
            <PreviousList
              id="reading-previous"
              items={earlierDays.map((day) => ({
                href: `/resources/${day.date}`,
                label: formatThoughtDate(day.date),
              }))}
            />
          </>
        ) : (
          <>
            <span className="label subsection" />
            <p className="slot empty subsection">Nothing filed yet. The morning reading lands around 6am PT.</p>
          </>
        )}
      </section>
    </>
  );
}
