import { ExternalLink } from "@/components/external-link";
import type { WorkItem } from "@/lib/work";

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
        <ExternalLink key={item.href} href={item.href} className="hit">
          {item.years ? <span className="label mono">{item.years}</span> : <span className="label" />}
          <span className="slot">
            <span className="work-title">{item.title}</span>
            <span className="note">{item.note}</span>
          </span>
        </ExternalLink>
      ))}
    </div>
  );
}
