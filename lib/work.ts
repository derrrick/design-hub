export type WorkItem = {
  title: string;
  href?: string;
  note: string;
  years?: string;
  store?: { label: string; href: string };
};

// Copy and links are the public portfolio at dschippert.com.
// Square’s years are the Block (Square) dates on /resume. The side projects publish no years.
// Titles and years are the public resume at dschippert.com/resume.
export const experience: WorkItem[] = [
  { years: "2019–2026", title: "Block (Square)", note: "Staff Product Designer" },
  { years: "2018–2019", title: "Dockyard", note: "Sr. Product Designer" },
  { years: "2018", title: "Google", note: "UX Designer" },
  { years: "2017", title: "UserTesting", note: "Sr. Product Designer" },
  { years: "2015–2017", title: "GoDaddy", note: "Sr. Product Designer" },
  { years: "2014–2015", title: "RetailMeNot", note: "Product Designer" },
  { years: "2013–2014", title: "Salesforce", note: "UI & UX Designer" },
  { years: "2011–2013", title: "LivingSocial", note: "UX Designer" },
];

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
  {
    title: "Cutline",
    href: "https://joincutline.com",
    store: {
      label: "App Store",
      href: "https://apps.apple.com/us/app/cutline-photo-critique/id6778603576",
    },
    note: "Honest critique on your photos, from photographers. Give one, get one back — on the web and iPhone.",
  },
];
