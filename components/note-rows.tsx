import Link from "next/link";

import { formatThoughtDate } from "@/lib/format";
import { headline, type Thought } from "@/lib/thoughts";

export function NoteRows({
  thoughts,
  between = false,
  dates = true,
}: {
  thoughts: Thought[];
  between?: boolean;
  dates?: boolean;
}) {
  return (
    <div className={between ? "rows rows--between" : "rows"}>
      {thoughts.map((thought) => (
        <Link key={thought.date} href={`/thoughts/${thought.date}`} className="row">
          <span>{headline(thought)}</span>
          {dates ? (
            <time className="mono muted" dateTime={thought.date}>
              {formatThoughtDate(thought.date)}
            </time>
          ) : null}
        </Link>
      ))}
    </div>
  );
}
