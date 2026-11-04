import Link from "next/link";

import { formatThoughtDate } from "@/lib/format";
import { headline, type Thought } from "@/lib/thoughts";

export function NoteRows({ thoughts }: { thoughts: Thought[] }) {
  return (
    <div className="rows">
      {thoughts.map((thought) => (
        <Link key={thought.date} href={`/thoughts/${thought.date}`} className="row">
          <span>{headline(thought)}</span>
          <time className="mono muted" dateTime={thought.date}>
            {formatThoughtDate(thought.date)}
          </time>
        </Link>
      ))}
    </div>
  );
}
