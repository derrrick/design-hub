import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_URL = "https://kfchwbwiqjykontpstgz.supabase.co";
const DEFAULT_KEY = "sb_publishable_a8aSc4A3BEkCUZgzf1KT3g_HglIDi94";

// Keep this aligned with `export const revalidate = 3600` on each route.
const REVALIDATE_SECONDS = 3600;

type NextFetchInit = RequestInit & {
  next?: { revalidate?: number };
};

function cachedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const { cache: _cache, ...rest } = init ?? {};
  return fetch(input, {
    ...rest,
    next: { revalidate: REVALIDATE_SECONDS },
  } as NextFetchInit);
}

export function getSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || DEFAULT_KEY;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: { fetch: cachedFetch },
  });
}
