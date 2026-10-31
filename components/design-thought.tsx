import { ExternalLink } from "@/components/external-link";
import { formatThoughtDate } from "@/lib/format";
import type { Thought } from "@/lib/thoughts";

export function DesignThought({ thought }: { thought: Thought }) {
  return (
    <article>
      <h1 className="piece-title">Design thoughts</h1>
      <p className="dek">
        <time dateTime={thought.date}>{formatThoughtDate(thought.date)}</time>
      </p>
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
    </article>
  );
}
