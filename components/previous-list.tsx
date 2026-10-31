"use client";

import Link from "next/link";
import { useState } from "react";

const PAGE = 5;

export function PreviousList({ items }: { items: { href: string; label: string }[] }) {
  const [shown, setShown] = useState(PAGE);
  if (items.length === 0) return null;
  const visible = items.slice(0, shown);
  const remaining = items.length - visible.length;

  return (
    <section className="previous" aria-labelledby="previous-heading">
      <h2 id="previous-heading">Previous</h2>
      <ul>
        {visible.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-link">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      {remaining > 0 ? (
        <p className="more">
          <button type="button" className="more-btn" onClick={() => setShown((count) => count + PAGE)}>
            More
          </button>
        </p>
      ) : null}
    </section>
  );
}
