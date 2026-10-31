import Link from "next/link";

import { ExternalLink } from "@/components/external-link";
import { formatDay } from "@/lib/format";
import { topicsInOrder } from "@/lib/ledger";
import type { FeedPost } from "@/lib/types";

function likes(count: number): string {
  return `${count.toLocaleString("en-US")} ${count === 1 ? "like" : "likes"}`;
}

function clip(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= 140) return clean;
  const cut = clean.slice(0, 140);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 60 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

export function HeadingFile({ posts }: { posts: FeedPost[] }) {
  if (posts.length === 0) return null;
  const date = posts[0]?.feedDate;
  const groups = topicsInOrder(posts);

  return (
    <section className="filed" aria-labelledby="filed-heading">
      <h2 id="filed-heading">
        Filed{" "}
        {date ? (
          <time dateTime={date} className="mono date">
            {formatDay(date)}
          </time>
        ) : null}
      </h2>
      {groups.map((group) => (
        <div key={group.topic} className="file-group">
          <h3 className="mono">{group.topic}</h3>
          <ul>
            {group.posts.map((post) => (
              <li key={post.id} className="file-item">
                <ExternalLink href={post.postUrl} className="text-link">
                  {post.authorName}
                </ExternalLink>
                {post.excerpt ? <p className="file-excerpt">{clip(post.excerpt)}</p> : null}
                <p className="file-meta mono">{likes(post.likes)}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <p className="more">
        <Link href="/today" className="text-link">
          Today
        </Link>
        <span className="sep"> · </span>
        <Link href="/resources" className="text-link">
          Resources
        </Link>
      </p>
    </section>
  );
}
