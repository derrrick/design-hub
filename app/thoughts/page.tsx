import type { Metadata } from "next";

import { BackLink, SiteFooter } from "@/components/back-link";
import { NoteRows } from "@/components/note-rows";
import { listThoughts } from "@/lib/thoughts";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Thoughts",
  description: "Weekly notes on where product design is heading.",
};

// Every Thought, newest first. The home page shows the latest few and links here.
export default function ThoughtsPage() {
  const thoughts = listThoughts();

  return (
    <div className="page page--tight">
      <BackLink href="/#thoughts" />

      <section className="section appear" aria-labelledby="all-h" style={{ ["--d" as string]: "80ms" }}>
        <h1 id="all-h" className="label">
          Thoughts
        </h1>
        {thoughts.length === 0 ? (
          <p className="empty">Nothing published yet.</p>
        ) : (
          <NoteRows thoughts={thoughts} />
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
