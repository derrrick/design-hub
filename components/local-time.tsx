"use client";

import { useEffect, useState } from "react";

const format = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  hour: "numeric",
  minute: "2-digit",
});

export function LocalTime() {
  const [now, setNow] = useState<string>("");

  useEffect(() => {
    const tick = () => setNow(format.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="mono" aria-label="Local time in Pacific Grove">
      {now}
    </span>
  );
}
