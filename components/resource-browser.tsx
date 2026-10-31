"use client";

import { useMemo, useState } from "react";

import { ExternalLink } from "@/components/external-link";
import type { Category, Resource } from "@/lib/types";

function haystack(resource: Resource, categoryName: string): string {
  return [resource.title, resource.note, resource.authorHandle, resource.tags.join(" "), categoryName]
    .join(" ")
    .toLowerCase();
}

function ResourceRow({ resource }: { resource: Resource }) {
  return (
    <li className="resource">
      {resource.url ? (
        <ExternalLink href={resource.url} className="text-link resource-title">
          {resource.title}
        </ExternalLink>
      ) : (
        <span className="resource-title">{resource.title}</span>
      )}
      {resource.note ? <p className="note">{resource.note}</p> : null}
      {resource.xPostUrl || resource.authorHandle ? (
        <p className="meta">
          {resource.xPostUrl && resource.xPostUrl !== resource.url ? (
            <ExternalLink href={resource.xPostUrl} className="text-link">
              Post
            </ExternalLink>
          ) : null}
          {resource.xPostUrl && resource.xPostUrl !== resource.url && resource.authorHandle ? (
            <span className="sep"> · </span>
          ) : null}
          {resource.authorHandle ? (
            resource.profileUrl ? (
              <ExternalLink href={resource.profileUrl} className="text-link">
                {resource.authorHandle}
              </ExternalLink>
            ) : (
              <span>{resource.authorHandle}</span>
            )
          ) : null}
        </p>
      ) : null}
    </li>
  );
}

export function ResourceBrowser({
  categories,
  resources,
}: {
  categories: Category[];
  resources: Resource[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const names = useMemo(() => new Map(categories.map((item) => [item.slug, item.name])), [categories]);
  const q = query.trim().toLowerCase();
  const browsing = q === "" && category === "all";

  const matched = resources.filter((resource) => {
    if (category !== "all" && resource.categorySlug !== category) return false;
    if (!q) return true;
    return haystack(resource, names.get(resource.categorySlug) ?? "").includes(q);
  });

  const startHere = browsing ? matched.filter((resource) => resource.featured) : [];

  const groups = categories.flatMap((cat) => {
    if (category !== "all" && cat.slug !== category) return [];
    const inCategory = matched.filter((resource) => resource.categorySlug === cat.slug);
    const items = browsing ? inCategory.filter((resource) => !resource.featured) : inCategory;
    if (browsing && items.length === 0 && inCategory.length > 0) return [];
    if (!browsing && items.length === 0) {
      if (q === "" && category === cat.slug) return [{ cat, items, empty: true }];
      return [];
    }
    if (browsing && inCategory.length === 0) return [{ cat, items: [], empty: true }];
    return [{ cat, items, empty: items.length === 0 }];
  });

  const nothing = startHere.length === 0 && groups.every((group) => group.items.length === 0);

  return (
    <div className="browser">
      <form className="tools" role="search" onSubmit={(event) => event.preventDefault()}>
        <label className="search-label mono" htmlFor="resource-search">
          Search
        </label>
        <div className="search-row">
          <input
            id="resource-search"
            type="search"
            name="q"
            value={query}
            placeholder="Title, note, or author"
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
        <div className="filters" role="group" aria-label="Filter by category">
          <button type="button" aria-pressed={category === "all"} onClick={() => setCategory("all")}>
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              aria-pressed={category === cat.slug}
              onClick={() => setCategory(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </form>

      {q && nothing ? (
        <p className="empty" aria-live="polite">
          No matches.
        </p>
      ) : null}
      {q && !nothing ? (
        <p className="count mono" aria-live="polite">
          {matched.length} {matched.length === 1 ? "match" : "matches"}
        </p>
      ) : null}

      {startHere.length > 0 ? (
        <section className="group" aria-labelledby="start-here">
          <h2 id="start-here">Start here</h2>
          <ul className="resources">
            {startHere.map((resource) => (
              <ResourceRow key={`featured-${resource.url}`} resource={resource} />
            ))}
          </ul>
        </section>
      ) : null}

      {groups.map((group) => (
        <section key={group.cat.slug} className="group" aria-labelledby={`cat-${group.cat.slug}`}>
          <h2 id={`cat-${group.cat.slug}`}>{group.cat.name}</h2>
          {group.cat.description ? <p className="dek">{group.cat.description}</p> : null}
          {group.empty ? (
            <p className="empty">Nothing saved here yet.</p>
          ) : (
            <ul className="resources">
              {group.items.map((resource) => (
                <ResourceRow key={resource.url} resource={resource} />
              ))}
            </ul>
          )}
        </section>
      ))}

      {!q && nothing ? <p className="empty">Nothing saved on the shelf yet.</p> : null}
    </div>
  );
}
