import { formatDayYear } from "@/lib/format";
import { listTopics, loudestPost, quietestPost, topicShift } from "@/lib/ledger";
import type { FeedPost } from "@/lib/types";

function likes(count: number): string {
  return `${count.toLocaleString("en-US")} ${count === 1 ? "like" : "likes"}`;
}

export function HeadingLedger({
  posts,
  previous,
  previousDate,
}: {
  posts: FeedPost[];
  previous: FeedPost[];
  previousDate: string | null;
}) {
  if (posts.length === 0) {
    return (
      <p className="ledger">
        Nothing has been filed yet. The reading below was written against the 31 Oct 2026 posts it
        links to.
      </p>
    );
  }

  const date = posts[0]?.feedDate;
  const loudest = loudestPost(posts);
  const quietest = quietestPost(posts);
  const shift = previousDate ? topicShift(posts, previous) : null;

  return (
    <p className="ledger">
      {posts.length} {posts.length === 1 ? "post" : "posts"} filed for{" "}
      {date ? <time dateTime={date}>{formatDayYear(date)}</time> : "the latest morning"}.{" "}
      {loudest ? (
        <>
          Most likes in the file: {loudest.authorName}, {likes(loudest.likes)}.{" "}
        </>
      ) : null}
      {quietest && quietest.id !== loudest?.id ? (
        <>
          Fewest: {quietest.authorName}, {likes(quietest.likes)}.{" "}
        </>
      ) : null}
      {shift && previousDate ? (
        shift.added.length === 0 && shift.dropped.length === 0 ? (
          <>Same subjects as {formatDayYear(previousDate)}.</>
        ) : (
          <>
            Since {formatDayYear(previousDate)}
            {shift.added.length > 0 ? <>: {listTopics(shift.added)} showed up</> : ": nothing new showed up"}
            {shift.dropped.length > 0 ? <>, and {listTopics(shift.dropped)} did not</> : null}.
          </>
        )
      ) : (
        <>One morning in the file so far.</>
      )}
    </p>
  );
}
