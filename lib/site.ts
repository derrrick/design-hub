export const site = {
  name: "Derrick Schippert",
  title: "Design Engineer",
  location: "Based in Bay Area",
  description: "Designer and engineer. Selected work from Square, side projects, and a weekly note on design.",
  personalSite: "https://dschippert.com",
  email: "dschippe@gmail.com",
  linkedin: "https://www.linkedin.com/in/derrickschippert",
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
