"use client";

import Link from "next/link";

import { RevealList } from "@/components/reveal-list";

export type NoteLink = {
  href: string;
  date: string;
  label: string;
  line: string;
};

export function ThoughtLinks({ notes }: { notes: NoteLink[] }) {
  if (notes.length === 0) return <p className="empty">Nothing published yet. The note lands Monday at 7am PT.</p>;

  return (
    <RevealList
      items={notes}
      size={5}
      getKey={(note) => note.href}
      render={(note) => (
        <Link href={note.href} className="line-row">
          <time className="mono when" dateTime={note.date}>
            {note.label}
          </time>
          <span className="line-text">{note.line}</span>
        </Link>
      )}
    />
  );
}
