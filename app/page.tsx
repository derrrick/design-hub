import Image from "next/image";

import { SiteFooter } from "@/components/back-link";
import { ExternalLink } from "@/components/external-link";
import { LocalTime } from "@/components/local-time";
import { NoteRows } from "@/components/note-rows";
import { site } from "@/lib/site";
import { listThoughts } from "@/lib/thoughts";
import { experience, sideProjects } from "@/lib/work";

export const revalidate = 3600;

const HOME_NOTES = 4;

// Case studies stay live at /work/[slug]; they are not linked from here.
export default function HomePage() {
  const notes = listThoughts().slice(0, HOME_NOTES);

  return (
    <div className="page">
      <header className="intro-head appear">
        <Image className="avatar" src="/derrick.jpg" alt="" width={40} height={40} priority />
        <h1 className="title">Derrick Schippert</h1>
      </header>

      <section className="stack appear" aria-label="About" style={{ ["--d" as string]: "130ms" }}>
        <p>
          I’m a designer and engineer in the Bay Area with 15+ years of experience building products. Most
          recently, at <ExternalLink href="https://squareup.com/us/en">Square</ExternalLink>, I designed across the
          seller journey: Square AI, sales, onboarding and support. Before that, I was at{" "}
          <ExternalLink href="https://about.google/">Google</ExternalLink>,{" "}
          <ExternalLink href="https://www.salesforce.com/">Salesforce</ExternalLink>,{" "}
          <ExternalLink href="https://www.godaddy.com/">GoDaddy</ExternalLink> and{" "}
          <ExternalLink href="https://www.usertesting.com/">UserTesting</ExternalLink>.
        </p>
        <p>
          Download my{" "}
          <a href="/derrick-schippert-resume.pdf" download="Derrick-Schippert-Resume.pdf">
            resume
          </a>
          .
        </p>
      </section>

      <section className="section appear" aria-labelledby="side-h" style={{ ["--d" as string]: "200ms" }}>
        <h2 id="side-h" className="label">
          Side projects
        </h2>
        <div className="rows rows--between">
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

      <section id="thoughts" className="section appear" aria-labelledby="notes-h" style={{ ["--d" as string]: "270ms" }}>
        <h2 id="notes-h" className="label">
          Thoughts
        </h2>
        {notes.length === 0 ? (
          <p className="empty">Nothing published yet. The note lands Monday at 7am PT.</p>
        ) : (
          <NoteRows thoughts={notes} between dates={false} />
        )}
      </section>

      <section id="experience" className="section appear" aria-labelledby="exp-h" style={{ ["--d" as string]: "340ms" }}>
        <h2 id="exp-h" className="label">
          Experience
        </h2>
        <ul className="roles">
          {experience.map((role) => (
            <li key={role.company}>
              <span>
                <span className="role-company">{role.company}</span> <span className="mono muted">{role.years}</span>
              </span>
              <span className="muted">{role.title}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="stack appear" aria-labelledby="connect-h" style={{ ["--d" as string]: "410ms" }}>
        <h2 id="connect-h" className="label">
          Connect
        </h2>
        <p>
          Hiring, building something hard, or just want to talk shop?
          <br />
          Email <a href={`mailto:${site.email}`}>{site.email}</a>. I’m also on{" "}
          <ExternalLink href={site.linkedin}>LinkedIn</ExternalLink>.
        </p>
      </section>

      <SiteFooter name={false}>
        <LocalTime />
      </SiteFooter>
    </div>
  );
}
