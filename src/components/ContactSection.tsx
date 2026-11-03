import { CONTACT, OPD_HOURS } from "@/data/site";
import { Icon } from "./Icon";
import { SocialLinks } from "./SocialLinks";

/**
 * Compact contact and location block used on the home page and the Contact Us page.
 * Phone numbers are tel: links; the address and the button open the official Google Maps link.
 */
export function ContactSection() {
  return (
    <div className="contact-layout">
      <ul className="contact-cards">
        <li className="contact-card">
          <span className="icon-chip icon-chip--solid" aria-hidden="true">
            <Icon name="phone" size={22} />
          </span>
          <div>
            <span className="contact-label">UAN</span>
            <a className="contact-value" href={CONTACT.uanHref}>
              {CONTACT.uan}
            </a>
          </div>
        </li>
        <li className="contact-card">
          <span className="icon-chip icon-chip--solid" aria-hidden="true">
            <Icon name="phone" size={22} />
          </span>
          <div>
            <span className="contact-label">Phone</span>
            <a className="contact-value" href={CONTACT.phoneHref}>
              {CONTACT.phone}
            </a>
          </div>
        </li>
        <li className="contact-card">
          <span className="icon-chip icon-chip--solid" aria-hidden="true">
            <Icon name="clock" size={22} />
          </span>
          <div>
            <span className="contact-label">OPD Hours</span>
            <span className="contact-value contact-value--text">{OPD_HOURS.range}</span>
            <span className="contact-days">{OPD_HOURS.days}</span>
          </div>
        </li>
        <li className="contact-card contact-card--social">
          <div>
            <span className="contact-label">Follow us</span>
            <SocialLinks className="social-links--light social-links--compact" />
          </div>
        </li>
      </ul>

      <div className="map-card">
        <div className="map-art" aria-hidden="true">
          <span className="map-road map-road--a" />
          <span className="map-road map-road--b" />
          <span className="map-road map-road--c" />
          <span className="map-pin">
            <Icon name="map-pin" size={30} />
          </span>
        </div>
        <div className="map-body">
          <p className="contact-label">Address</p>
          <p className="map-address">
            <a href={CONTACT.mapUrl} target="_blank" rel="noopener noreferrer" className="address-link">
              {CONTACT.address}
              <span className="visually-hidden"> (opens Google Maps in a new tab)</span>
            </a>
          </p>
          <a className="btn btn--solid" href={CONTACT.mapUrl} target="_blank" rel="noopener noreferrer">
            <Icon name="navigation" size={18} /> Get Directions
            <span className="visually-hidden"> (opens Google Maps in a new tab)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
