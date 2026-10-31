import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";

import { ExternalLink } from "@/components/external-link";
import { SiteNav } from "@/components/site-nav";
import { hubUrl, site } from "@/lib/site";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(hubUrl()),
  title: {
    default: site.name,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.name, url: site.personalSite }],
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "Daily reading" }],
    },
  },
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
    locale: "en_US",
    siteName: site.name,
  },
  twitter: {
    card: "summary",
    title: site.name,
    description: site.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#141413" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: hubUrl(),
    description: site.description,
    author: {
      "@type": "Person",
      name: site.name,
      jobTitle: "Staff Product Designer",
      url: site.personalSite,
    },
  };

  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a className="skip" href="#content">
          Skip to content
        </a>
        <div className="column">
          <header className="mast">
            <Link className="name" href="/">
              {site.name}
            </Link>
            <p className="role">{site.role}</p>
            <SiteNav />
          </header>
          <main id="content" tabIndex={-1}>
            {children}
          </main>
          <footer className="footer">
            <ExternalLink href={site.personalSite}>dschippert.com</ExternalLink>
            <a href="/feed.xml">Feed</a>
          </footer>
        </div>
      </body>
    </html>
  );
}
