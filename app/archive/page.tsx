import type { Metadata } from "next";
import Link from "next/link";

import { DayIndex } from "@/components/day-index";
import { getEarlierDays } from "@/lib/hub";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Earlier",
  description: "Previous days of the product design reading list.",
};

export default async function ArchivePage() {
  const days = await getEarlierDays();

  return (
    <>
      <h1>Earlier</h1>
      {days.length === 0 ? (
        <>
          <p className="empty">No earlier days yet.</p>
          <p className="more">
            <Link href="/" className="text-link">
              Today
            </Link>
          </p>
        </>
      ) : (
        <DayIndex days={days} />
      )}
    </>
  );
}
