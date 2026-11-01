# Design hub

A quiet one-page reading site for Derrick Schippert. The home page opens with a round profile photo, then the intro, Experience, Recent work, and short lists for Thoughts and Trends. Square lists its five case studies underneath as a short arrow list. Each list shows a batch and a More button for the next batch. Section names sit in a left label column. A dated note lives at `/thoughts/[date]`, and a day’s posts at `/resources/[date]`, each with a back link home.

Thoughts on the home page are date plus the first line, linking to the full note. A new note is published Monday at 7:00am Pacific from the previous seven days of posts and a web search. Trends is the morning’s X posts and the saved links, one section for how the work is moving. Posts are a name and a short line, with no date on the row. Saved links are the title plus the category and who shared it, newest first, and a quiet search. Featured items lead only within the same day. Dates stay on the day index at the bottom, and on the day page. The import time is not the post date.

`/feed.xml` is still the RSS feed. It is not linked from the page. `/work`, `/resources`, `/today`, and `/archive` redirect to the matching section on the home page. `/resources` lands on Trends.

The app only reads those three tables. It never writes, and it does not touch anything else in the Supabase project. Pages revalidate every hour, so a morning insert shows up without a redeploy. On Vercel, a cron at 14:15 UTC (after the 6am PT insert, in both PDT and PST) calls `/api/cron` and revalidates the layout so the new file is not waiting on the hour.

Design thoughts is written by `.github/workflows/design-thought.yml`. The schedule is 14:00 and 15:00 UTC on Monday, and `scripts/publish-thought.mjs` continues only when the clock in `America/Los_Angeles` says Monday 7:00am, so the note stays at 7:00am through daylight saving. It reads the previous seven days of `hub_feed_posts` (and bookmarks from those days, when a handful were saved), searches recent writing via the Hacker News index and the feeds from Luke Wroblewski, Nielsen Norman Group, and Smashing Magazine, then asks GitHub Models for a short opinionated note. Citations have to be URLs from that material, and there are at most five. The workflow commits `content/thoughts/YYYY-MM-DD.json`. GitHub only runs the schedule from the default branch, and Actions has to be enabled. The built-in `GITHUB_TOKEN` is enough (`models: read` is set on the workflow). Set `THOUGHT_MODEL` in the workflow if you want a different model id. An existing file for that date is left alone.

Plain Next.js App Router. To hang this under a rebuilt [dschippert.com](https://dschippert.com) later, move `app/`, `components/`, `lib/`, `content/thoughts/`, and `app/globals.css` into that repo (or serve this app at a path with `basePath`). The weekly note is the GitHub Action above, not a Vercel-only API. The resources feed stays daily.

## Local

Node 20 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Public fallbacks for the Supabase URL and publishable key live in `lib/supabase.ts`, so `next build` works with an empty environment. To point at another project, copy `.env.example` to `.env.local` and edit it.

```bash
cp .env.example .env.local
```

| Variable | Required | What it is |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | No, if the fallback project is fine | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | No, if the fallback key is fine | Public client key. RLS allows `SELECT` only. Never a secret or service-role key. |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical origin for absolute URLs in the RSS feed, no trailing slash. |
| `CRON_SECRET` | No | Bearer token for `/api/cron`. Set the same value in the Vercel project. If it is missing, the route returns 401 and only the hourly revalidation runs. |

## Vercel

1. Import this GitHub repo. Framework preset is Next.js. Build command `next build`, output left default.
2. Set the env vars above for Production (and Preview, if you want). `NEXT_PUBLIC_*` values are baked in at build time, so change them with a redeploy.
3. Set `NEXT_PUBLIC_SITE_URL` to the production origin once you know it (custom domain or `https://<project>.vercel.app`). If you skip it, RSS uses `VERCEL_PROJECT_PRODUCTION_URL`.
4. Deploy. Do not add a Supabase service-role key.
5. Optional: set `CRON_SECRET` in Production. Vercel sends it as `Authorization: Bearer <CRON_SECRET>` when the cron in `vercel.json` hits `/api/cron` (`15 14 * * *`, 7:15am PDT / 6:15am PST). Cron runs on production deployments only. The route compares the header with `timingSafeEqual` and then revalidates the layout. Without the secret, the morning file still appears on the next hourly revalidation.

The morning job writes `hub_feed_posts` on its own. This site picks that up on the cron, or on the next hourly revalidation if the cron is not configured. The interval is the `revalidate = 3600` export on each route, and the same window on the Supabase fetch in `lib/supabase.ts`. Change both if you want the baseline tighter.

The Monday note is separate from that cron. It lands as a commit, which is what publishes it. To run it by hand: Actions → Design thought → Run workflow, and check “Publish even when it is not Monday 7:00am Pacific”. It will not overwrite a note that is already filed for that date.

## Scripts

```bash
npm run dev
npm run build
npm start
```
