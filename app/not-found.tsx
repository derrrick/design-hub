import Link from "next/link";

export default function NotFound() {
  return (
    <section className="band">
      <p className="label">
        <Link href="/" className="back">
          Back
        </Link>
      </p>
      <div className="slot">
        <h1>This page isn’t here.</h1>
        <p className="empty">The link may have changed.</p>
      </div>
    </section>
  );
}
