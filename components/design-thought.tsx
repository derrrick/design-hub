import { ExternalLink } from "@/components/external-link";
import type { Thought } from "@/lib/thoughts";

export function DesignThought({ thought }: { thought: Thought }) {
  return (
    <div className="prose">
      {thought.paragraphs.map((paragraph, index) => (
        <p key={index}>
          {paragraph.map((span, spanIndex) =>
            span.href ? (
              <ExternalLink key={spanIndex} href={span.href} className="text-link">
                {span.text}
              </ExternalLink>
            ) : (
              <span key={spanIndex}>{span.text}</span>
            ),
          )}
        </p>
      ))}
    </div>
  );
}
