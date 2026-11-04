import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackLink, SiteFooter } from "@/components/back-link";
import { DesignThought } from "@/components/design-thought";
import { NoteRows } from "@/components/note-rows";
import { formatNoteDate, isIsoDate } from "@/lib/format";
import { getThought, headline, listThoughts, readMinutes } from "@/lib/thoughts";

export const revalidate = 3600;

const MORE = 3;

export function generateStaticParams() {
  return listThoughts().map((thought) => ({ date: thought.date }));
}

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }): Promise<Metadata> {
  const { date } = await params;
  const thought = isIsoDate(date) ? getThought(date) : null;
  if (!thought) return { title: "Notes" };
  return {
    title: headline(thought).replace(/\.$/, ""),
    description: `A note on design from ${formatNoteDate(date)}.`,
  };
}

export default async function ThoughtPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  if (!isIsoDate(date)) notFound();
  const thought = getThought(date);
  if (!thought) notFound();

  const all = listThoughts();
  const older = all.filter((item) => item.date < thought.date).slice(0, MORE);
  const newer = all.filter((item) => item.date > thought.date).slice(-MORE);
  const showOlder = older.length > 0;

  return (
    <div className="page page--tight">
      <BackLink href="/#thoughts" />

      <article className="stack appear" style={{ ["--d" as string]: "80ms" }}>
        <header className="note-head mono">
          <time dateTime={thought.date}>{formatNoteDate(thought.date)}</time>
          <span>{readMinutes(thought)} min read</span>
        </header>
        <h1 className="title">{headline(thought)}</h1>
        <DesignThought thought={thought} />
      </article>

      {showOlder || newer.length > 0 ? (
        <section className="section appear" aria-labelledby="more-h" style={{ ["--d" as string]: "160ms" }}>
          <h2 id="more-h" className="label">
            {showOlder ? "Previous" : "Newer"}
          </h2>
          <NoteRows thoughts={showOlder ? older : newer} />
        </section>
      ) : null}

      <SiteFooter />
    </div>
  );
}
