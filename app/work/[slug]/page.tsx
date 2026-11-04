import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";

import { BackLink, SiteFooter } from "@/components/back-link";
import { ExternalLink } from "@/components/external-link";
import { site } from "@/lib/site";
import { caseStudies, getCaseStudy, type Block, type Rich, type Shot } from "@/lib/work";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return { title: "Work" };
  return { title: study.title, description: study.lede };
}

const pad = (n: number) => String(n).padStart(2, "0");

function RichText({ value }: { value: Rich }) {
  if (typeof value === "string") return value;
  return value.map((part, index) =>
    typeof part === "string" ? (
      <Fragment key={index}>{part}</Fragment>
    ) : (
      <ExternalLink key={index} href={part.href} className="inline-link">
        {part.text}
      </ExternalLink>
    ),
  );
}

function ShotFigure({ shot, className, delay }: { shot: Shot; className?: string; delay?: string }) {
  return (
    <figure
      className={`shot ${className ?? ""} ${delay ? "appear" : ""}`.trim()}
      style={delay ? { ["--d" as string]: delay } : undefined}
    >
      <div className="shot-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={shot.dark ? "lt has-dark" : "lt"} src={shot.src} alt={shot.alt} loading={delay ? "eager" : "lazy"} />
        {shot.dark ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="dk" src={shot.dark} alt={shot.alt} loading="lazy" />
        ) : null}
      </div>
      <figcaption className="mono">{shot.caption}</figcaption>
    </figure>
  );
}

function BlockView({ block, number }: { block: Block; number: number }) {
  if (block.kind === "shot") {
    return <ShotFigure shot={block.shot} className={block.shot.narrow ? "measure" : "wide"} />;
  }
  if (block.kind === "pair") {
    return (
      <div className="pair wide">
        {block.shots.map((shot) => (
          <ShotFigure key={shot.src} shot={shot} />
        ))}
      </div>
    );
  }
  return (
    <section className="stack measure">
      <h2 className="label numbered">
        <span className="mono">{pad(number)}</span>
        <span>{block.title}</span>
      </h2>
      {block.body.map((paragraph, index) => (
        <p key={index}>
          <RichText value={paragraph} />
        </p>
      ))}
      {block.ticks ? (
        <ul className="ticks">
          {block.ticks.map((tick) => (
            <li key={tick}>{tick}</li>
          ))}
        </ul>
      ) : null}
      {block.defs ? (
        <dl className="meta">
          {block.defs.map(([term, value]) => (
            <Fragment key={term}>
              <dt className="mono">{term}</dt>
              <dd>{value}</dd>
            </Fragment>
          ))}
        </dl>
      ) : null}
      {block.pullquote ? (
        <blockquote className="quote">
          <p>{block.pullquote}</p>
        </blockquote>
      ) : null}
      {block.quote ? (
        <blockquote className="quote">
          <p>{block.quote.text}</p>
          <footer className="mono">{block.quote.by}</footer>
        </blockquote>
      ) : null}
    </section>
  );
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const index = caseStudies.indexOf(study);
  const next = caseStudies[(index + 1) % caseStudies.length];
  const isLast = index === caseStudies.length - 1;
  let sectionNumber = 0;

  return (
    <div className="spread">
      <div className="measure stack stack--loose">
        <BackLink href="/#work" />

        <header className="stack appear" style={{ ["--d" as string]: "60ms" }}>
          <div className="section-head mono muted">
            <span>
              {pad(index + 1)} / {pad(caseStudies.length)}
            </span>
            <span>Square, {study.years}</span>
          </div>
          <h1 className="title">{study.title}</h1>
          <p>{study.lede}</p>
        </header>

        <dl className="meta appear" style={{ ["--d" as string]: "120ms" }}>
          {study.meta.map(([term, value]) => (
            <Fragment key={term}>
              <dt className="mono">{term}</dt>
              <dd>
                <RichText value={value} />
              </dd>
            </Fragment>
          ))}
        </dl>

        {study.stats.length > 0 ? (
          <div className="stats appear" style={{ ["--d" as string]: "180ms" }}>
            {study.stats.map((stat) => (
              <div key={stat.value} className="stat">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <ShotFigure shot={study.hero} className="wide" delay="240ms" />

      {study.blocks.map((block, blockIndex) => {
        if (block.kind === "section") sectionNumber += 1;
        return <BlockView key={blockIndex} block={block} number={sectionNumber} />;
      })}

      <section className="section measure">
        <h2 className="label" style={{ marginBottom: 8 }}>
          What changed
        </h2>
        <ul className="results">
          {study.results.map((result) => (
            <li key={result}>{result}</li>
          ))}
        </ul>
        {study.kicker ? <p className="kicker">{study.kicker}</p> : null}
      </section>

      <div className="measure stack" style={{ gap: 48 }}>
        <div className="rows">
          <Link href={`/work/${next.slug}`} className="row row--index">
            <span className="mono muted">{pad(caseStudies.indexOf(next) + 1)}</span>
            <span>{next.title}</span>
            <span className="mono muted">{isLast ? "Start over →" : "Next →"}</span>
          </Link>
        </div>
        <SiteFooter>
          <a className="mono" href={`mailto:${site.email}`}>
            Email
          </a>
        </SiteFooter>
      </div>
    </div>
  );
}
