"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function RevealList<T>({
  items,
  size,
  getKey,
  render,
}: {
  items: T[];
  size: number;
  getKey: (item: T) => string;
  render: (item: T) => ReactNode;
}) {
  const [shown, setShown] = useState(size);
  const listRef = useRef<HTMLUListElement>(null);
  const pendingFocus = useRef<number | null>(null);

  useEffect(() => {
    if (pendingFocus.current == null) return;
    const index = pendingFocus.current;
    pendingFocus.current = null;
    const node = listRef.current?.children[index]?.querySelector("a, button");
    if (node instanceof HTMLElement) node.focus();
  }, [shown]);

  if (items.length === 0) return null;
  const visible = items.slice(0, shown);
  const remaining = items.length - visible.length;

  return (
    <div className="stack">
      <ul className="lines" ref={listRef}>
        {visible.map((item) => (
          <li key={getKey(item)}>{render(item)}</li>
        ))}
      </ul>
      {remaining > 0 ? (
        <button
          type="button"
          className="more-btn"
          onClick={() => {
            pendingFocus.current = shown;
            setShown((count) => count + size);
          }}
        >
          More
        </button>
      ) : null}
    </div>
  );
}
