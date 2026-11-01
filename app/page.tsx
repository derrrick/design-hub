import Image from "next/image";
import Link from "next/link";

import { AboutIntro } from "@/components/about-intro";
import { ExternalLink } from "@/components/external-link";
import { ThoughtLinks } from "@/components/home-lists";
import { ExperienceList, WorkList } from "@/components/work-list";
import { formatThoughtDate } from "@/lib/format";
import { site } from "@/lib/site";
import { listThoughts, type Thought } from "@/lib/thoughts";
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

function firstLine(thought: Thought): string {
  const text = thought.paragraphs[0]?.map((span) => span.text).join("") ?? "";
  const sentence = text.match(/^[\s\S]*?[.!?](?=\s|$)/)?.[0] ?? text;
  return oneLine(sentence, 96);
}

export default function HomePage() {
  const notes = listThoughts().map((thought) => ({
    href: `/thoughts/${thought.date}`,
    date: thought.date,
    label: formatThoughtDate(thought.date),
    line: firstLine(thought),
  }));

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
        </div>
      </div>
    </div>
  );
}
