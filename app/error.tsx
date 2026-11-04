"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="page page--tight">
      <a href="/" className="back">
        Back
      </a>
      <section className="stack">
        <h1 className="title">This page didn’t load.</h1>
        <p className="empty">Something went wrong. It’s usually temporary.</p>
        <button type="button" className="retry" onClick={() => reset()}>
          Try again
        </button>
      </section>
    </div>
  );
}
