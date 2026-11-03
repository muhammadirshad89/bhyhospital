import Image from "next/image";
import { CONTACT, OPD_HOURS } from "@/data/site";
import { SUNDAY_OPD } from "@/data/sunday-opd";
import { Icon } from "./Icon";

/** Prominent homepage promotion for Sunday OPD, built from the official poster. */
export function SundayOpdSection() {
  const { poster } = SUNDAY_OPD;
  return (
    <section className="sunday" aria-labelledby="sunday-title">
      <div className="container sunday-grid">
        <div className="sunday-copy">
          <p className="eyebrow eyebrow--light">Sunday OPD</p>
          <h2 id="sunday-title">{SUNDAY_OPD.heading}</h2>
          <p className="sunday-hours">
            <Icon name="clock" size={20} />
            <span>
              <strong>{OPD_HOURS.label}</strong>
              <span className="sunday-days">{OPD_HOURS.days}</span>
            </span>
          </p>
          <p>{SUNDAY_OPD.intro}</p>
          <ul className="sunday-list">
            {SUNDAY_OPD.sessions.map((s) => (
              <li key={s.specialty}>
                <span>{s.specialty}</span>
                <strong>{s.time}</strong>
              </li>
            ))}
          </ul>
          <p className="actions">
            <a className="btn btn--light" href={CONTACT.uanHref}>
              <Icon name="phone" size={18} /> Call UAN {CONTACT.uan}
            </a>
            <a className="btn btn--ghost" href={CONTACT.phoneHref}>
              <Icon name="phone" size={18} /> {CONTACT.phone}
            </a>
          </p>
        </div>
        <figure className="sunday-poster">
          <a href={poster.src} target="_blank" rel="noopener noreferrer" className="sunday-poster-link">
            <Image
              src={poster.src}
              alt={poster.alt}
              width={poster.width}
              height={poster.height}
              sizes="(min-width: 64rem) 520px, (min-width: 40rem) 70vw, 100vw"
              quality={80}
            />
            <span className="visually-hidden"> (opens the full-size poster in a new tab)</span>
          </a>
          <figcaption>Tap or click the poster to open it full size.</figcaption>
        </figure>
      </div>
    </section>
  );
}
