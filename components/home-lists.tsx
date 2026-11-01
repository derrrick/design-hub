"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ExternalLink } from "@/components/external-link";
import { RevealList } from "@/components/reveal-list";

export type NoteLink = {
  href: string;
  date: string;
  label: string;
  line: string;
};

export type ResourceLink = {
  href: string;
  title: string;
  meta: string;
  date: string;
  label: string;
  haystack: string;
};

export type PostLink = {
  href: string;
  title: string;
  meta: string;
  date: string;
  label: string;
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

export function ResourceLinks({ items }: { items: ResourceLink[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const matched = useMemo(
    () => (q ? items.filter((item) => item.haystack.includes(q)) : items),
    [items, q],
  );

  return (
    <>
      <form className="tools" role="search" onSubmit={(event) => event.preventDefault()}>
        <div className="search-row">
          <label className="sr-only" htmlFor="resource-search">
            Search resources
          </label>
          <input
            id="resource-search"
            type="search"
            name="q"
            value={query}
            placeholder="Search"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query ? (
            <button type="button" className="clear" onClick={() => setQuery("")}>
              Clear
            </button>
          ) : null}
        </div>
      </form>
      {q && matched.length === 0 ? (
        <p className="empty" aria-live="polite">
          No matches.
        </p>
      ) : (
        <RevealList
          key={q}
          items={matched}
          size={10}
          getKey={(item) => `${item.date}:${item.href}:${item.title}`}
          render={(item) => (
            <ExternalLink href={item.href} className="line-row">
              {item.label ? (
                <time className="mono when" dateTime={item.date}>
                  {item.label}
                </time>
              ) : (
                <span className="when" />
              )}
              <span className="line-body">
                <span className="line-title">{item.title}</span>
                {item.meta ? <span className="line-meta mono">{item.meta}</span> : null}
              </span>
            </ExternalLink>
          )}
        />
      )}
    </>
  );
}

export function PostLinks({ posts }: { posts: PostLink[] }) {
  if (posts.length === 0) return <p className="empty">Nothing filed yet.</p>;

  return (
    <RevealList
      items={posts}
      size={5}
      getKey={(post) => post.href}
      render={(post) => (
        <ExternalLink href={post.href} className="line-row">
          {post.label ? (
            <time className="mono when" dateTime={post.date}>
              {post.label}
            </time>
          ) : (
            <span className="when" />
          )}
          <span className="line-body">
            <span className="line-title">{post.title}</span>
            {post.meta ? <span className="line-meta line-note">{post.meta}</span> : null}
          </span>
        </ExternalLink>
      )}
    />
  );
}

export function DayLinks({ days }: { days: NoteLink[] }) {
  return (
    <RevealList
      items={days}
      size={5}
      getKey={(day) => day.href}
      render={(day) => (
        <Link href={day.href} className="line-row">
          <time className="mono when" dateTime={day.date}>
            {day.label}
          </time>
          <span className="line-text">{day.line}</span>
        </Link>
      )}
    />
  );
}
