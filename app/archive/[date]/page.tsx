import { redirect } from "next/navigation";

import { isIsoDate } from "@/lib/format";

export default async function ArchiveDayPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  if (!isIsoDate(date)) redirect("/#thoughts");
  redirect(`/resources/${date}`);
}
