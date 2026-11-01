import Link from "next/link";

import { AboutIntro } from "@/components/about-intro";
import { DayLinks, PostLinks, ResourceLinks, ThoughtLinks } from "@/components/home-lists";
import { Mark3D } from "@/components/mark-3d";
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

  const days = earlierDays.map((day) => ({
    href: `/resources/${day.date}`,
    date: day.date,
    label: formatThoughtDate(day.date),
    line: `${day.count} ${day.count === 1 ? "post" : "posts"}`,
  }));

  return (
    <>
      <section className="hero">
        <Mark3D />
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

      <section className="band" id="work">
        <h2 className="label">Work</h2>
        <div className="slot" />
        <WorkList heading="Professional" items={professional} first />
        <WorkList heading="Side projects" items={sideProjects} />
      </section>

      <section className="band" id="thoughts">
        <h2 className="label">Thoughts</h2>
        <div className="slot">
          <ThoughtLinks notes={notes} />
        </div>
      </section>

      {reading.date ? (
        <section className="band" id="posts">
          <h2 className="label">
            <Link
              href={`/resources/${reading.date}`}
              className="label-link"
              aria-label={`Posts for ${formatThoughtDate(reading.date)}`}
            >
              Posts
            </Link>
          </h2>
          <div className="slot">
            {!reading.isToday ? (
              <p className="empty lead-in">Nothing new yet today. Showing the latest posts.</p>
            ) : null}
            <PostLinks posts={posts} />
            {days.length > 0 ? (
              <div className="earlier">
                <h3 className="label inline-label">Earlier</h3>
                <DayLinks days={days} />
              </div>
            ) : null}
          </div>
        </section>
      ) : (
        <section className="band" id="posts">
          <h2 className="label">Posts</h2>
          <p className="slot empty">Nothing filed yet. The morning posts land around 6am PT.</p>
        </section>
      )}

      <section className="band" id="resources">
        <h2 className="label">Resources</h2>
        <div className="slot">
          <ResourceLinks items={shelf} />
        </div>
      </section>
    </>
  );
}
