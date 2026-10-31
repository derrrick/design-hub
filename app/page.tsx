import type { Metadata } from "next";

import { DesignThought } from "@/components/design-thought";
import { getLatestThought } from "@/lib/thoughts";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Design thoughts",
  description: "A short daily note on where product design is heading.",
};

export default function ThoughtsPage() {
  const thought = getLatestThought();

  if (!thought) {
    return (
      <>
        <h1 className="piece-title">Design thoughts</h1>
        <p className="empty">Nothing published yet. The note lands at 3am PT.</p>
      </>
    );
  }

  return <DesignThought thought={thought} />;
}
