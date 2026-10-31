export const site = {
  name: "Derrick Schippert",
  title: "Design Engineer",
  location: "Based in Bay Area",
  description: "Design thoughts, a reading shelf, and selected work.",
  personalSite: "https://dschippert.com",
} as const;

export function hubUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return `https://${production}`;
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
