import { CONTACT } from "@/data/site";
import { Icon } from "./Icon";

/** Location panel linked to the official Google Maps place. No coordinates are embedded or guessed. */
export function LocationCard() {
  return (
    <div className="location-card">
      <span className="icon-chip icon-chip--solid icon-chip--lg" aria-hidden="true">
        <Icon name="map-pin" size={30} />
      </span>
      <h3>Begum Haji Yousuf Hospital</h3>
      <p>{CONTACT.address}</p>
      <a className="btn btn--solid" href={CONTACT.mapUrl} target="_blank" rel="noopener noreferrer">
        <Icon name="navigation" size={18} /> Get Directions
        <span className="visually-hidden"> (opens Google Maps in a new tab)</span>
      </a>
    </div>
  );
}
