import { timingSafeEqual } from "node:crypto";

import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

function authorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  const header = request.headers.get("authorization");
  if (!secret || !header) return false;
  const expected = `Bearer ${secret}`;
  const got = Buffer.from(header);
  const want = Buffer.from(expected);
  if (got.length !== want.length) return false;
  return timingSafeEqual(got, want);
}

export function GET(request: NextRequest) {
  if (!authorized(request)) {
    return new Response("Unauthorized", { status: 401 });
  }

  revalidatePath("/", "layout");

  return Response.json({
    revalidated: true,
    at: new Date().toISOString(),
  });
}
