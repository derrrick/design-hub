import { Fragment } from "react";

import { ExternalLink } from "@/components/external-link";
import type { WorkItem } from "@/lib/work";

export function ExperienceList({ items }: { items: WorkItem[] }) {
  return (
    <ul className="roles">
      {items.map((item) => (
        <li key={item.title}>
          <span className="role-line">
            <span className="job">{item.title}</span>
            {item.years ? <span>{item.years}</span> : null}
          </span>
          <span className="note">{item.note}</span>
        </li>
      ))}
    </ul>
  );
}

export function WorkList({
  heading,
  items,
}: {
  heading?: string;
  items: WorkItem[];
}) {
  return (
    <div className="subrows">
      {heading ? (
        <>
          <h3 className="label group-label">{heading}</h3>
          <div className="slot group-label" />
        </>
      ) : null}
      {items.map((item) => (
        <Fragment key={item.href ?? item.title}>
          <WorkRow item={item} />
          {item.children?.length ? (
            <div className="subs">
              {item.children.map((child) => (
                <ExternalLink key={child.href ?? child.title} href={child.href ?? ""} className="sub">
                  <span aria-hidden="true">→</span>
                  <span className="sub-title">{child.title}</span>
                </ExternalLink>
              ))}
            </div>
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}

function WorkRow({ item }: { item: WorkItem }) {
  const years = item.years ? <span className="label mono">{item.years}</span> : <span className="label" />;
  const note = item.note ? <span className="note">{item.note}</span> : null;

  if (item.store && item.href) {
    return (
      <div className="hit">
        {years}
        <span className="slot">
          <span className="who">
            <ExternalLink href={item.href} className="work-title">
              {item.title}
            </ExternalLink>
            <ExternalLink href={item.store.href} className="text-link">
              {item.store.label}
            </ExternalLink>
          </span>
          {note}
        </span>
      </div>
    );
  }

  return (
    <ExternalLink href={item.href ?? item.store?.href ?? ""} className="hit">
      {years}
      <span className="slot">
        <span className="work-title">{item.title}</span>
        {note}
      </span>
    </ExternalLink>
  );
}
