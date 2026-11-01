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
  first = false,
}: {
  heading: string;
  items: WorkItem[];
  first?: boolean;
}) {
  const gap = first ? "first-group" : "group-label";

  return (
    <div className="subrows">
      <h3 className={`label ${gap}`}>{heading}</h3>
      <div className={`slot ${gap}`} />
      {items.map((item) => (
        <WorkRow key={item.href ?? item.title} item={item} />
      ))}
    </div>
  );
}

function WorkRow({ item }: { item: WorkItem }) {
  const years = item.years ? <span className="label mono">{item.years}</span> : <span className="label" />;
  const note = <span className="note">{item.note}</span>;

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
