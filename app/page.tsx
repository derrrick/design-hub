import Image from "next/image";
import Link from "next/link";

import { SiteFooter } from "@/components/back-link";
import { ExternalLink } from "@/components/external-link";
import { LocalTime } from "@/components/local-time";
import { formatThoughtDate } from "@/lib/format";
import { site } from "@/lib/site";
import { headline, listThoughts } from "@/lib/thoughts";
import { caseStudies, sideProjects } from "@/lib/work";

export const revalidate = 3600;

const HOME_NOTES = 4;

export default function HomePage() {
  const thoughts = listThoughts();
  const notes = thoughts.slice(0, HOME_NOTES);

  return (
    <div className="page">
      <Image className="avatar appear" src="/derrick.jpg" alt="Derrick Schippert" width={40} height={40} priority />

      <section className="stack appear" aria-label="About" style={{ ["--d" as string]: "130ms" }}>
        <p>Hello there,</p>
        <p>I design and build software, mostly within enterprise systems.</p>
        <p>
          I have 15+ years experience. Most recently, I was at <Link href="/work/unified-ai-surfaces">Square</Link>,
          working on AI, onboarding, and help across the seller journey. Before that, Google, Salesforce, GoDaddy and
          UserTesting. Here’s my{" "}
          <a href="/derrick-schippert-resume.pdf" download="Derrick-Schippert-Resume.pdf">
            resume
          </a>
          .
        </p>
        <p>Currently on sabbatical, building fun side projects and spending time with family.</p>
        <p>Off the clock: Detroit sports, photography, golf, and F1.</p>
      </section>

      <section id="work" className="section appear" aria-labelledby="work-h" style={{ ["--d" as string]: "200ms" }}>
        <h2 id="work-h" className="label">
          Square
        </h2>
        <div className="rows">
          {caseStudies.map((study, index) => (
            <Link key={study.slug} href={`/work/${study.slug}`} className="row row--index">
              <span className="mono muted">{String(index + 1).padStart(2, "0")}</span>
              <span>{study.title}</span>
              <span className="mono muted">{study.tag}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section appear" aria-labelledby="side-h" style={{ ["--d" as string]: "270ms" }}>
        <h2 id="side-h" className="label">
          Side projects
        </h2>
        <div className="rows">
          {sideProjects.map((project) => (
            <ExternalLink key={project.href} href={project.href} className="row">
              <span>
                <span className="strong">{project.title}</span>
                <span className="muted"> — {project.note}</span>
              </span>
              <span className="mono muted">{project.platform}</span>
            </ExternalLink>
          ))}
        </div>
      </section>

      <section id="thoughts" className="section appear" aria-labelledby="notes-h" style={{ ["--d" as string]: "340ms" }}>
        <h2 id="notes-h" className="label">
          Notes
        </h2>
        {notes.length === 0 ? (
          <p className="empty">Nothing published yet. The note lands Monday at 7am PT.</p>
        ) : (
          <div className="rows">
            {notes.map((thought) => (
              <Link key={thought.date} href={`/thoughts/${thought.date}`} className="row">
                <span>{headline(thought)}</span>
                <time className="mono muted" dateTime={thought.date}>
                  {formatThoughtDate(thought.date)}
                </time>
              </Link>
            ))}
          </div>
        )}
        {thoughts.length > 0 ? (
          <Link href="/thoughts" className="mono more">
            More
          </Link>
        ) : null}
      </section>

      <section className="stack appear" aria-labelledby="connect-h" style={{ ["--d" as string]: "410ms" }}>
        <h2 id="connect-h" className="label">
          Connect
        </h2>
        <p>
          Hiring, building something hard, or just want to talk shop? Email{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>. I’m also on{" "}
          <ExternalLink href={site.linkedin} className="inline-link">
            LinkedIn
          </ExternalLink>
          .
        </p>
      </section>

      <SiteFooter>
        <LocalTime />
      </SiteFooter>
    </div>
  );
}
