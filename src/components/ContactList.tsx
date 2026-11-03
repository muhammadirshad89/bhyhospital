import { CONTACT, OPD_HOURS } from "@/data/site";

/** UAN, phone and address. The address opens the official Google Maps link in a new tab. */
export function ContactList({ className = "" }: { className?: string }) {
  return (
    <dl className={`contact-list ${className}`.trim()}>
      <div>
        <dt>UAN</dt>
        <dd>
          <a href={CONTACT.uanHref}>{CONTACT.uan}</a>
        </dd>
      </div>
      <div>
        <dt>Phone</dt>
        <dd>
          <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
        </dd>
      </div>
      <div>
        <dt>OPD Hours</dt>
        <dd>
          {OPD_HOURS.range} <span className="contact-days">({OPD_HOURS.days})</span>
        </dd>
      </div>
      <div>
        <dt>Address</dt>
        <dd>
          <a href={CONTACT.mapUrl} target="_blank" rel="noopener noreferrer" className="address-link">
            {CONTACT.address}
            <span className="visually-hidden"> (opens Google Maps in a new tab)</span>
          </a>
        </dd>
      </div>
    </dl>
  );
}
