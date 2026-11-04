import Link from "next/link";

export function BackLink({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="back appear">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M7.5 2.5 4 6l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>Back</span>
    </Link>
  );
}

export function SiteFooter({ children }: { children?: React.ReactNode }) {
  return (
    <footer className="footer">
      <span className="mono">©2026 Derrick Schippert</span>
      {children}
    </footer>
  );
}
