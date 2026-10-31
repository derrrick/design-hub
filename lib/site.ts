export const site = {
  name: "Derrick Schippert",
  role: "Staff product designer",
  description:
    "An argument about where product design is heading, a daily reading list, and a shelf of resources kept from X.",
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
