import Image from "next/image";
import Link from "next/link";

import { AboutIntro } from "@/components/about-intro";
import { ExternalLink } from "@/components/external-link";
import { DayLinks, PostLinks, ResourceLinks, ThoughtLinks } from "@/components/home-lists";
import { ExperienceList, WorkList } from "@/components/work-list";
import { formatThoughtDate } from "@/lib/format";
import { getCategories, getEarlierDays, getLatestReading, getResources } from "@/lib/hub";
import { site } from "@/lib/site";
import { listThoughts, type Thought } from "@/lib/thoughts";
import type { Resource } from "@/lib/types";
import { experience, professional, sideProjects } from "@/lib/work";

export const revalidate = 3600;

function oneLine(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed = (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trimEnd();
  return `${trimmed.replace(/[.,;:]+$/, "")}…`;
}

function byBookmarkDate(a: Resource, b: Resource): number {
  if (a.postedOn !== b.postedOn) {
    if (!a.postedOn) return 1;
    if (!b.postedOn) return -1;
    return a.postedOn < b.postedOn ? 1 : -1;
  }
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  return a.title.localeCompare(b.title, "en");
}

function firstLine(thought: Thought): string {
  const text = thought.paragraphs[0]?.map((span) => span.text).join("") ?? "";
  const sentence = text.match(/^[\s\S]*?[.!?](?=\s|$)/)?.[0] ?? text;
  return oneLine(sentence, 96);
}

export default async function HomePage() {
  const notes = listThoughts().map((thought) => ({
    href: `/thoughts/${thought.date}`,
    date: thought.date,
    label: formatThoughtDate(thought.date),
    line: firstLine(thought),
  }));

  const [categories, resources, reading, earlierDays] = await Promise.all([
    getCategories(),
    getResources(),
    getLatestReading(),
    getEarlierDays(),
  ]);

  const names = new Map(categories.map((category) => [category.slug, category.name]));
  const shelf = resources
    .filter((item) => item.url)
    .sort(byBookmarkDate)
    .map((item) => {
      const category = names.get(item.categorySlug) ?? "";
      const meta = [category, item.authorHandle].filter(Boolean).join(" · ");
      const date = item.postedOn ?? "";
      const label = date ? formatThoughtDate(date) : "";
      return {
        href: item.url,
        title: item.title,
        meta,
        date,
        label,
        haystack: [item.title, meta, item.note, item.tags.join(" "), date, label].join(" ").toLowerCase(),
      };
    });

  const posts = reading.posts.map((post) => {
    const date = post.postedOn ?? "";
    return {
      href: post.postUrl,
      title: post.authorName,
      meta: oneLine(post.excerpt || post.note || "", 72),
      date,
      label: date ? formatThoughtDate(date) : "",
    };
  });

  const days = [
    ...(reading.date
      ? [
          {
            href: `/resources/${reading.date}`,
            date: reading.date,
            label: formatThoughtDate(reading.date),
            line: `${reading.posts.length} ${reading.posts.length === 1 ? "post" : "posts"}`,
          },
        ]
      : []),
    ...earlierDays.map((day) => ({
      href: `/resources/${day.date}`,
      date: day.date,
      label: formatThoughtDate(day.date),
      line: `${day.count} ${day.count === 1 ? "post" : "posts"}`,
    })),
  ];

  return (
    <div className="split">
      <div className="intro-pane">
        <div className="intro-body">
          <section className="hero">
            <div className="portrait">
              <Image
                src="/derrick.jpg"
                alt="Derrick Schippert"
                width={64}
                height={64}
                sizes="64px"
                priority
              />
            </div>
            <h1>
              <Link className="name" href="/">
                {site.name}
              </Link>
            </h1>
            <AboutIntro />
          </section>

          <section className="band" id="experience">
            <h2 className="label">Experience</h2>
            <ExperienceList items={experience} />
          </section>
        </div>
        <footer className="pane-foot">
          <p>
            <a className="foot-link" href={`mailto:${site.email}`}>
              Email
            </a>
            <span className="foot-sep" aria-hidden="true">
              |
            </span>
            <ExternalLink href={site.linkedin} className="foot-link">
              LinkedIn
            </ExternalLink>
          </p>
          <p>©2026</p>
        </footer>
      </div>
      <div className="work-pane">
        <div className="sheet">
          <section className="band" id="work">
            <h2 className="label">Recent work</h2>
            <div className="slot" />
            <WorkList items={professional} />
            <WorkList heading="Side projects" items={sideProjects} />
          </section>

          <section className="band" id="thoughts">
            <h2 className="label">Thoughts</h2>
            <div className="slot">
              <ThoughtLinks notes={notes} />
            </div>
          </section>

          <section className="band" id="trends">
            <h2 className="label">Trends</h2>
            <div className="slot">
              {reading.date ? (
                <>
                  {!reading.isToday ? (
                    <p className="empty lead-in">
                      Nothing new yet today. Latest is {formatThoughtDate(reading.date)}.
                    </p>
                  ) : null}
                  <PostLinks posts={posts} />
                </>
              ) : (
                <p className="empty">Nothing filed yet. The morning posts land around 6am PT.</p>
              )}
              <div className="earlier">
                <h3 className="label inline-label">Saved</h3>
                <ResourceLinks items={shelf} />
              </div>
              {days.length > 0 ? (
                <div className="earlier">
                  <h3 className="label inline-label">Days</h3>
                  <DayLinks days={days} />
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
