import { ExternalLink } from "@/components/external-link";
import { site } from "@/lib/site";
import { sideProjects } from "@/lib/work";

function ProjectLink({ title }: { title: string }) {
  const project = sideProjects.find((item) => item.title === title);
  if (!project) return title;
  return (
    <ExternalLink href={project.href} className="text-link">
      {title}
    </ExternalLink>
  );
}

export function AboutIntro() {
  return (
    <>
      <p className="identity">
        <span className="mono">{site.title}</span>
        <span className="mono">{site.location}</span>
      </p>
      <p className="lede">
        Product designer and builder. Eight years at Square working on AI, help, and pricing systems
        across the seller journey. Before that, Google, Salesforce, and UserTesting. I also design
        and build my own software: <ProjectLink title="Punch" />, <ProjectLink title="Artifact" />,{" "}
        <ProjectLink title="HPW" />, and <ProjectLink title="Vector" />.
      </p>
    </>
  );
}
