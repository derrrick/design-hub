import { ExternalLink } from "@/components/external-link";
import { bodyParagraphs, type Thought, type ThoughtSpan } from "@/lib/thoughts";

function Spans({ spans }: { spans: ThoughtSpan[] }) {
  return spans.map((span, spanIndex) =>
    span.href ? (
      <ExternalLink key={spanIndex} href={span.href} className="inline-link">
        {span.text}
      </ExternalLink>
    ) : (
      <span key={spanIndex}>{span.text}</span>
    ),
  );
}

function linesOf(paragraph: ThoughtSpan[]): ThoughtSpan[][] {
  const lines: ThoughtSpan[][] = [[]];
  for (const span of paragraph) {
    const parts = span.text.split("\n");
    parts.forEach((part, index) => {
      if (index > 0) lines.push([]);
      if (part.length > 0) lines[lines.length - 1].push(span.href ? { text: part, href: span.href } : { text: part });
    });
  }
  return lines.filter((line) => line.some((span) => span.text.trim().length > 0));
}

function asList(paragraph: ThoughtSpan[]): ThoughtSpan[][] | null {
  const lines = linesOf(paragraph);
  if (lines.length < 2 || lines.length > 3) return null;
  const numbered = lines.every((line) => /^\d+\.\s+\S/.test(line.map((span) => span.text).join("").trim()));
  if (!numbered) return null;
  return lines.map((line) => {
    const next = line.map((span) => ({ ...span }));
    next[0] = { ...next[0], text: next[0].text.replace(/^\s*\d+\.\s+/, "") };
    return next.filter((span) => span.text.length > 0);
  });
}

// A short last line with no links is the note's sign-off; it gets the strong color.
function isClosing(paragraph: ThoughtSpan[], index: number, count: number): boolean {
  if (index !== count - 1) return false;
  if (paragraph.some((span) => span.href)) return false;
  return paragraph.map((span) => span.text).join("").trim().length <= 80;
}

export function DesignThought({ thought }: { thought: Thought }) {
  const paragraphs = bodyParagraphs(thought);
  return (
    <div className="prose">
      {paragraphs.map((paragraph, index) => {
        const list = asList(paragraph);
        if (list) {
          return (
            <ol key={index}>
              {list.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Spans spans={item} />
                </li>
              ))}
            </ol>
          );
        }
        return (
          <p key={index} className={isClosing(paragraph, index, paragraphs.length) ? "closing" : undefined}>
            <Spans spans={paragraph} />
          </p>
        );
      })}
    </div>
  );
}
