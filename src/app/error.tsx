"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="section state-page">
      <div className="container narrow">
        <p className="eyebrow">Something went wrong</p>
        <h1>This page could not be loaded</h1>
        <p className="lead">Try again, or return to the home page. If the problem continues, please call the hospital.</p>
        <p className="actions">
          <button type="button" className="btn btn--solid" onClick={reset}>
            Try again
          </button>
          <Link className="btn btn--outline" href="/">
            Go to the home page
          </Link>
        </p>
      </div>
    </section>
  );
}
