"use client";

import Link from "next/link";
import { useState } from "react";

const PAGE = 5;

export function PreviousList({
  items,
  id,
}: {
  items: { href: string; label: string }[];
  id: string;
}) {
  const [shown, setShown] = useState(PAGE);
  if (items.length === 0) return null;
  const visible = items.slice(0, shown);
  const remaining = items.length - visible.length;

  return (
    <div className="subrows" role="region" aria-labelledby={id}>
      <h3 className="label group-label" id={id}>
        Previous
      </h3>
      <div className="slot group-label" />
      {visible.map((item) => (
        <div className="pair" key={item.href}>
          <Link href={item.href} className="label date-link">
            {item.label}
          </Link>
          <span className="slot" />
        </div>
      ))}
      {remaining > 0 ? (
        <div className="pair">
          <div className="label">
            <button type="button" className="more-btn" onClick={() => setShown((count) => count + PAGE)}>
              More
            </button>
          </div>
          <span className="slot" />
        </div>
      ) : null}
    </div>
  );
}
