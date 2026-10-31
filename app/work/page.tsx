import type { Metadata } from "next";

import { WorkList } from "@/components/work-list";
import { professional, sideProjects } from "@/lib/work";

export const metadata: Metadata = {
  title: "Work",
  description: "Professional work at Square, and side projects Punch, Artifact, HPW, and Vector.",
};

export default function WorkPage() {
  return (
    <>
      <h1>Work</h1>
      <WorkList heading="Professional" items={professional} />
      <WorkList heading="Side projects" items={sideProjects} />
    </>
  );
}
