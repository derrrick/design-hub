import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <h1>This page isn’t here.</h1>
      <p className="empty">The link may have changed.</p>
      <p className="more">
        <Link href="/" className="text-link">
          Design thoughts
        </Link>
      </p>
    </>
  );
}
