import { ContactList } from "@/components/ContactList";
import { LocationCard } from "@/components/LocationCard";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { SocialLinks } from "@/components/SocialLinks";
import { CONTACT, SITE } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Us",
  description: `Call ${SITE.name} on ${CONTACT.phone} or UAN ${CONTACT.uan}, and find the hospital address and directions in Clifton, Karachi.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact Us"
        lead="Call the hospital or get directions to Delhi Colony, Clifton, Karachi."
        crumbs={[{ name: "Contact Us" }]}
      />
      <section className="section">
        <div className="container split">
          <div>
            <div className="panel">
              <h2>Hospital contact details</h2>
              <ContactList />
            </div>
            <p className="actions">
              <a className="btn btn--solid" href={CONTACT.mapUrl} target="_blank" rel="noopener noreferrer">
                <Icon name="navigation" size={18} /> Get Directions
                <span className="visually-hidden"> (opens Google Maps in a new tab)</span>
              </a>
              <a className="btn btn--outline" href={CONTACT.phoneHref}>
                <Icon name="phone" size={18} /> Call {CONTACT.phone}
              </a>
            </p>

            <h2 className="h3 space-top">Follow us</h2>
            <SocialLinks className="social-links--light" />

            <p className="small muted space-top">
              An online enquiry form is not part of this version. Please call the hospital on the numbers above.
            </p>
          </div>
          <div>
            <h2>Find us</h2>
            <LocationCard />
          </div>
        </div>
      </section>
    </>
  );
}
