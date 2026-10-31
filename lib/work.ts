export type WorkItem = {
  title: string;
  href: string;
  note: string;
  years?: string;
};

// Copy and links are the public portfolio at dschippert.com.
// Square’s years are the Block (Square) dates on /resume. The side projects publish no years.
export const professional: WorkItem[] = [
  {
    years: "2019–2026",
    title: "Square",
    href: "https://dschippert.com/square",
    note: "Unified AI surfaces, help systems, and pricing architecture across the entire seller journey — from onboarding to enterprise support.",
  },
];

export const sideProjects: WorkItem[] = [
  {
    title: "Punch",
    href: "https://thepunch.studio/",
    note: "A curated directory of independent type foundries. No algorithms, no affiliate links — just a hand-selected collection of studios crafting exceptional typography.",
  },
  {
    title: "Artifact",
    href: "https://www.fartifact.space/explore?url=https%3A%2F%2Fcounter-print.co.uk&name=Counter-Print&bucket=independent_publishing&filter=independent_publishing",
    note: "Artifact catalogs the sites that prove the web is still the most exciting canvas on earth.",
  },
  {
    title: "HPW",
    href: "https://healthpricewatch.com/",
    note: "Automated compliance monitoring for hospital price transparency. Daily scans catch CMS violations before audits do — helping hospitals avoid up to $5,500/day in penalties.",
  },
  {
    title: "Vector",
    href: "https://www.vectordrop.app/",
    note: "A free Mac app for converting images to vectors. Drop a raster, get a clean SVG instantly.",
  },
];
