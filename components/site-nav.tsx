"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Heading", match: (path: string) => path === "/" },
  { href: "/today", label: "Today", match: (path: string) => path.startsWith("/today") },
  { href: "/resources", label: "Resources", match: (path: string) => path.startsWith("/resources") },
  { href: "/archive", label: "Earlier", match: (path: string) => path.startsWith("/archive") },
];

export function SiteNav() {
  const path = usePathname() || "/";

  return (
    <nav className="nav" aria-label="Sections">
      <ul>
        {links.map((link) => {
          const current = link.match(path);
          return (
            <li key={link.href}>
              <Link href={link.href} aria-current={current ? "page" : undefined}>
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
