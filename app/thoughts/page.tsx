import type { Metadata } from "next";

import { BackLink, SiteFooter } from "@/components/back-link";
import { NoteRows } from "@/components/note-rows";
import { listThoughts, type Thought } from "@/lib/thoughts";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Notes",
  description: "One short note on design every week.",
};

function byYear(thoughts: Thought[]): [string, Thought[]][] {
  const years = new Map<string, Thought[]>();
  for (const thought of thoughts) {
    const year = thought.date.slice(0, 4);
    years.set(year, [...(years.get(year) ?? []), thought]);
  }
  return [...years.entries()];
}

export default function NotesPage() {
  const groups = byYear(listThoughts());

  return (
    <div className="page page--tight">
      <BackLink href="/#thoughts" />

      <header className="stack appear" style={{ ["--d" as string]: "60ms" }}>
        <h1 className="title">Notes</h1>
        <p>One short note on design every week, usually about what AI is doing to the work. New ones land Monday mornings.</p>
      </header>

      {groups.length === 0 ? <p className="empty">Nothing published yet.</p> : null}

      {groups.map(([year, thoughts]) => (
        <section key={year} className="section appear" aria-labelledby={`y${year}`} style={{ ["--d" as string]: "120ms" }}>
          <h2 id={`y${year}`} className="mono muted">
            {year}
          </h2>
          <NoteRows thoughts={thoughts} />
        </section>
      ))}

      <SiteFooter />
    </div>
  );
}
