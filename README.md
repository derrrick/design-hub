# Design hub

A quiet reading site for Derrick Schippert. Two things:

- **Today** — the latest daily pass at where product design is heading (`hub_feed_posts`, about 20 posts, filed around 6am PT).
- **Resources** — a shelf of links kept from X (`hub_resources`, grouped by `hub_categories`).

Earlier days are an index at `/archive`, one page per date. `/feed.xml` is an RSS feed of recent posts.

The app only reads those three tables. It never writes, and it does not touch anything else in the Supabase project. Pages revalidate every hour, so a morning insert shows up without a redeploy.

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

## Vercel

1. Import this GitHub repo. Framework preset is Next.js. Build command `next build`, output left default.
2. Set the env vars above for Production (and Preview, if you want). `NEXT_PUBLIC_*` values are baked in at build time, so change them with a redeploy.
3. Set `NEXT_PUBLIC_SITE_URL` to the production origin once you know it (custom domain or `https://<project>.vercel.app`). If you skip it, RSS uses `VERCEL_PROJECT_PRODUCTION_URL`.
4. Deploy. Do not add a Supabase service-role key.

The morning job writes `hub_feed_posts` on its own. This site picks that up on the next hourly revalidation. The interval is the `revalidate = 3600` export on each route, and the same window on the Supabase fetch in `lib/supabase.ts`. Change both if you want it tighter.

## Scripts

```bash
npm run dev
npm run build
npm start
```
