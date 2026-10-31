/** Skeleton shown while a page loads. Uses the same grid as the doctor and department cards to avoid layout shift. */
export default function Loading() {
  return (
    <div aria-busy="true">
      <p className="visually-hidden" role="status">
        Loading…
      </p>
      <div className="skeleton-header" aria-hidden="true">
        <div className="container">
          <div className="skeleton skeleton-line skeleton-line--short" />
          <div className="skeleton skeleton-title" />
        </div>
      </div>
      <section className="section" aria-hidden="true">
        <div className="container">
          <div className="doctor-grid">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton skeleton-photo" />
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line skeleton-line--short" />
                <div className="skeleton skeleton-line" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
