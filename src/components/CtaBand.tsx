import { CONTACT } from "@/data/site";
import { Icon } from "./Icon";

/** Slim "plan your visit" strip shown above the footer on inner pages. */
export function CtaBand() {
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="container cta-inner">
        <h2 id="cta-title">Plan your visit</h2>
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
