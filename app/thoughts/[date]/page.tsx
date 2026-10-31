import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackLink } from "@/components/back-link";
import { DesignThought } from "@/components/design-thought";
import { PreviousList } from "@/components/previous-list";
import { formatThoughtDate, isIsoDate } from "@/lib/format";
import { getThought, listThoughts } from "@/lib/thoughts";

export const revalidate = 3600;

export function generateStaticParams() {
  return listThoughts().map((thought) => ({ date: thought.date }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await params;
  if (!isIsoDate(date) || !getThought(date)) return { title: "Thoughts" };
  return {
    title: formatThoughtDate(date),
    description: `Design thoughts for ${formatThoughtDate(date)}.`,
  };
}

export default async function ThoughtDatePage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  if (!isIsoDate(date)) notFound();
  const thought = getThought(date);
  if (!thought) notFound();

  const previous = listThoughts()
    .filter((item) => item.date < thought.date)
    .map((item) => ({ href: `/thoughts/${item.date}`, label: formatThoughtDate(item.date) }));

  return (
    <section className="band">
      <BackLink href="/#thoughts" />
      <h1 className="label follows">
        <time dateTime={thought.date}>{formatThoughtDate(thought.date)}</time>
      </h1>
      <div className="slot follows">
        <DesignThought thought={thought} />
      </div>
      <PreviousList id="thought-previous" items={previous} />
    </section>
  );
}
