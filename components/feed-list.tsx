import { ExternalLink } from "@/components/external-link";
import { metric } from "@/lib/format";
import type { FeedPost } from "@/lib/types";

function Meta({ post }: { post: FeedPost }) {
  const metrics = [
    metric(post.likes, "like", "likes"),
    metric(post.reposts, "repost", "reposts"),
    metric(post.replies, "reply", "replies"),
  ].filter((item): item is string => Boolean(item));

  if (metrics.length === 0 && !post.article) return null;

  return (
    <p className="meta mono">
      {metrics.length > 0 ? <span>{metrics.join(" · ")}</span> : null}
      {metrics.length > 0 && post.article ? <span className="sep"> · </span> : null}
      {post.article ? (
        <ExternalLink href={post.article.href} className="text-link">
          {post.article.label}
        </ExternalLink>
      ) : null}
    </p>
  );
}

export function FeedList({ posts, label }: { posts: FeedPost[]; label: string }) {
  if (posts.length === 0) return null;

  return (
    <ol className="feed" aria-label={label}>
      {posts.map((post) => (
        <li key={post.id}>
          <article className="post">
            <p className="who">
              <ExternalLink href={post.postUrl} className="text-link who-name">
                {post.authorName}
                <span className="sr-only"> on X</span>
              </ExternalLink>
              {post.authorHandle ? (
                post.profileUrl ? (
                  <ExternalLink href={post.profileUrl} className="handle mono text-link">
                    {post.authorHandle}
                  </ExternalLink>
                ) : (
                  <span className="handle mono">{post.authorHandle}</span>
                )
              ) : null}
              {post.topic ? <span className="topic mono">{post.topic}</span> : null}
            </p>
            {post.excerpt ? <p className="excerpt">{post.excerpt}</p> : null}
            {post.note ? <p className="note">{post.note}</p> : null}
            <Meta post={post} />
          </article>
        </li>
      ))}
    </ol>
  );
}
