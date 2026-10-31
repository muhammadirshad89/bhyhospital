import { CONTACT } from "@/data/site";
import { Icon } from "./Icon";

export function CtaBand() {
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="container cta-inner">
        <div>
          <h2 id="cta-title">Plan your visit</h2>
          <p>Call the hospital to confirm timings, or get directions to Delhi Colony, Clifton.</p>
        </div>
        <div className="cta-actions">
          <a className="btn btn--light" href={CONTACT.uanHref}>
            <Icon name="phone" size={18} /> UAN {CONTACT.uan}
          </a>
          <a className="btn btn--ghost" href={CONTACT.mapUrl} target="_blank" rel="noopener noreferrer">
            <Icon name="navigation" size={18} /> Get Directions
            <span className="visually-hidden"> (opens Google Maps in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
