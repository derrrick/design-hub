import Link from "next/link";

export function BackLink({ href }: { href: string }) {
  return (
    <div className="pair">
      <Link href={href} className="label back">
        Back
      </Link>
      <span className="slot" />
    </div>
  );
}
