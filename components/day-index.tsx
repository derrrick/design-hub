import Link from "next/link";

import { formatDay, formatDayYear, postCount } from "@/lib/format";
import type { FeedDay } from "@/lib/types";

function groupByYear(days: FeedDay[]): { year: string; days: FeedDay[] }[] {
  const groups: { year: string; days: FeedDay[] }[] = [];
  for (const day of days) {
    const year = day.date.slice(0, 4);
    const last = groups[groups.length - 1];
    if (!last || last.year !== year) groups.push({ year, days: [day] });
    else last.days.push(day);
  }
  return groups;
}

export function DayIndex({ days }: { days: FeedDay[] }) {
  const groups = groupByYear(days);

  return (
    <div className="years">
      {groups.map((group) => (
        <ul key={group.year} className="index" aria-label={group.year}>
          {group.days.map((day, index) => (
            <li key={day.date}>
              <Link
                href={`/archive/${day.date}`}
                aria-label={`${formatDayYear(day.date)}, ${postCount(day.count)}`}
              >
                <span className="year mono" aria-hidden="true">
                  {index === 0 ? group.year : ""}
                </span>
                <span className="row-title">{formatDay(day.date)}</span>
                <span className="count mono" aria-hidden="true">
                  {postCount(day.count)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
