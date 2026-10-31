import { ExternalLink } from "@/components/external-link";
import type { WorkItem } from "@/lib/work";

function WorkRow({ item }: { item: WorkItem }) {
  return (
    <li>
      <ExternalLink href={item.href} className={item.years ? "work-row has-year" : "work-row"}>
        {item.years ? <span className="mono year">{item.years}</span> : null}
        <span className="work-title">{item.title}</span>
        <span className="note">{item.note}</span>
      </ExternalLink>
    </li>
  );
}

export function WorkList({ heading, items }: { heading: string; items: WorkItem[] }) {
  return (
    <section className="work-group">
      <h2>{heading}</h2>
      <ul className="work">
        {items.map((item) => (
          <WorkRow key={item.href} item={item} />
        ))}
      </ul>
    </section>
  );
}
