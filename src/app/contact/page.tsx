import { ContactSection } from "@/components/ContactSection";
import { PageHeader } from "@/components/PageHeader";
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
      <section className="section section--tight">
        <div className="container">
          <ContactSection />
          <p className="small muted contact-note">
            An online enquiry form is not part of this version. Please call the hospital on the numbers above.
          </p>
        </div>
      </section>
    </>
  );
}
