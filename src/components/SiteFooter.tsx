import Image from "next/image";
import Link from "next/link";
import { CONTACT, CREDIT, NAV_LINKS, SITE } from "@/data/site";
import { ContactList } from "./ContactList";
import { Icon } from "./Icon";
import { SocialLinks } from "./SocialLinks";

const IMPORTANT = [
  { href: "/services", label: "Medical Services" },
  { href: "/opd-schedule", label: "OPD Schedule" },
  { href: "/about", label: "About Us" },
  { href: "/privacy-policy", label: "Privacy Policy" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logos">
            <Image src="/brand/bhy-logo-white.png" alt="B.H.Y. Hospital" width={720} height={222} />
            <Image src="/brand/jpsd-emblem-white.png" alt="JPSD emblem" width={302} height={417} />
          </div>
          <p>{SITE.projectLine}</p>
          <p>{SITE.managedBy}</p>
          <h2 className="footer-follow">Follow us</h2>
          <SocialLinks />
        </div>

        <nav aria-label="Quick links">
          <h2>Quick links</h2>
          <ul>
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Important pages">
          <h2>Important pages</h2>
          <ul>
            {IMPORTANT.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2>Contact</h2>
          <ContactList className="contact-list--footer" />
          <a className="footer-find" href={CONTACT.mapUrl} target="_blank" rel="noopener noreferrer">
            <Icon name="map-pin" size={18} /> Find Us: Get Directions
            <span className="visually-hidden"> (opens Google Maps in a new tab)</span>
          </a>
        </div>
      </div>

      <div className="container footer-legal">
        <p>&copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
        <p>This website gives general information and does not replace advice from a qualified doctor.</p>
      </div>

      <div className="footer-credit">
        <div className="container footer-credit-row">
          <p>{CREDIT.text}</p>
          <p>
            {CREDIT.phoneLabel} <a href={CREDIT.phoneHref}>{CREDIT.phoneDisplay}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
