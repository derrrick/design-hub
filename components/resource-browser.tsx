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
        <p className="meta mono">
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

function Group({
  id,
  label,
  description,
  items,
}: {
  id: string;
  label: string;
  description?: string | null;
  items: Resource[];
}) {
  if (items.length === 0) return null;

  return (
    <div className="subrows">
      <h3 className="label group-label" id={id}>
        {label}
      </h3>
      <div className="slot group-label">
        {description ? <p className="note">{description}</p> : null}
        <ul className="resources">
          {items.map((resource) => (
            <ResourceRow key={resource.url} resource={resource} />
          ))}
        </ul>
      </div>
    </div>
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
  const names = useMemo(() => new Map(categories.map((item) => [item.slug, item.name])), [categories]);
  const q = query.trim().toLowerCase();
  const browsing = q === "";

  const matched = resources.filter((resource) => {
    if (!q) return true;
    return haystack(resource, names.get(resource.categorySlug) ?? "").includes(q);
  });

  const startHere = browsing ? matched.filter((resource) => resource.featured) : [];

  const groups = categories.flatMap((cat) => {
    const inCategory = matched.filter((resource) => resource.categorySlug === cat.slug);
    const items = browsing ? inCategory.filter((resource) => !resource.featured) : inCategory;
    if (items.length === 0) return [];
    return [{ cat, items }];
  });

  const nothing = startHere.length === 0 && groups.length === 0;

  return (
    <div className="contents">
      <form className="slot tools" role="search" onSubmit={(event) => event.preventDefault()}>
        <div className="search-row">
          <label className="sr-only" htmlFor="resource-search">
            Search resources
          </label>
          <input
            id="resource-search"
            type="search"
            name="q"
            value={query}
            placeholder="Search resources"
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

      {q && nothing ? (
        <div className="pair">
          <span className="label" />
          <p className="slot empty" aria-live="polite">
            No matches.
          </p>
        </div>
      ) : null}
      {q && !nothing ? (
        <div className="pair">
          <span className="label" />
          <p className="slot count mono" aria-live="polite">
            {matched.length} {matched.length === 1 ? "match" : "matches"}
          </p>
        </div>
      ) : null}

      <Group id="start-here" label="Start here" items={startHere} />
      {groups.map((group) => (
        <Group
          key={group.cat.slug}
          id={`cat-${group.cat.slug}`}
          label={group.cat.name}
          description={group.cat.description}
          items={group.items}
        />
      ))}

      {!q && nothing ? (
        <div className="pair">
          <span className="label" />
          <p className="slot empty">Nothing saved on the shelf yet.</p>
        </div>
      ) : null}
    </div>
  );
}
