"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="band">
      <p className="label">
        <a href="/" className="back">
          Back
        </a>
      </p>
      <div className="slot">
        <h1>The shelf didn’t load.</h1>
        <p className="empty">Something went wrong reading the list.</p>
        <button type="button" className="retry" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </section>
  );
}
