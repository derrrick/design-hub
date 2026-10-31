import { rfc822, xmlEscape } from "@/lib/format";
import { getRecentPosts } from "@/lib/hub";
import { hubUrl, site } from "@/lib/site";

export const revalidate = 3600;

export async function GET() {
  const posts = await getRecentPosts(40);
  const origin = hubUrl();
  const self = `${origin}/feed.xml`;

  const items = posts
    .map((post) => {
      const title = post.topic ? `${post.authorName} — ${post.topic}` : post.authorName;
      const body = [post.excerpt, post.note, post.article?.href].filter(Boolean).join("\n\n");
      return `    <item>
      <title>${xmlEscape(title)}</title>
      <link>${xmlEscape(post.postUrl)}</link>
      <guid isPermaLink="true">${xmlEscape(post.postUrl)}</guid>
      <pubDate>${rfc822(post.postedAt)}</pubDate>
      ${post.topic ? `<category>${xmlEscape(post.topic)}</category>` : ""}
      <description>${xmlEscape(body)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(`${site.name} — daily reading`)}</title>
    <link>${xmlEscape(origin)}</link>
    <description>${xmlEscape(site.description)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${xmlEscape(self)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
