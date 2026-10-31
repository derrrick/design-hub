# Design hub

A quiet reading site for Derrick Schippert. Three things:

- **Heading** (`/`) — an editorial argument about where product design is heading. The prose is written by hand and dated. It does not regenerate. The ledger and the “Filed” list under it are counted from the latest morning in `hub_feed_posts`, so those move when a new day lands.
- **Today** (`/today`) — that morning file itself. About 20 posts, inserted around 6am PT.
- **Resources** — a shelf of links kept from X (`hub_resources`, grouped by `hub_categories`).

Earlier days are an index at `/archive`, one page per date. `/feed.xml` is an RSS feed of recent posts.

The app only reads those three tables. It never writes, and it does not touch anything else in the Supabase project. Pages revalidate every hour, so a morning insert shows up without a redeploy. On Vercel, a cron at 14:15 UTC (after the 6am PT insert, in both PDT and PST) calls `/api/cron` and revalidates the layout so the new file is not waiting on the hour.

Plain Next.js App Router. No Vercel-only APIs. To hang this under a rebuilt [dschippert.com](https://dschippert.com) later, move `app/`, `components/`, `lib/`, and `app/globals.css` into that repo (or serve this app at a path with `basePath`).

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

Heading’s argument is edited in `components/heading-essay.tsx`. Update it when the reading changes. Do not wire it to a model that rewrites the page overnight. The ledger in `components/heading-ledger.tsx` is the part that should move by itself.

## Scripts

```bash
npm run dev
npm run build
npm start
```
