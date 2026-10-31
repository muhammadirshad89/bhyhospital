import { CONTACT } from "@/data/site";
import { Icon } from "./Icon";

/** Slim contact strip above the navbar: UAN, phone and directions. */
export function TopBar() {
  return (
    <div className="topbar">
      <div className="container topbar-row">
        <p className="topbar-numbers">
          <span>
            <Icon name="phone" size={14} /> UAN: <a href={CONTACT.uanHref}>{CONTACT.uan}</a>
          </span>
          <span>
            Phone: <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
          </span>
        </p>
        <a className="topbar-find" href={CONTACT.mapUrl} target="_blank" rel="noopener noreferrer">
          <Icon name="map-pin" size={14} /> Find us on Google Maps
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
