import { BackLink, SiteFooter } from "@/components/back-link";

export default function NotFound() {
  return (
    <div className="page page--tight">
      <BackLink href="/" />
      <section className="stack">
        <h1 className="title">This page isn’t here.</h1>
        <p className="empty">The link may have changed.</p>
      </section>
      <SiteFooter />
    </div>
  );
}
