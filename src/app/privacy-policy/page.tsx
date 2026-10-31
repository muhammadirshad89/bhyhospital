import { PageHeader } from "@/components/PageHeader";
import { SITE } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How the ${SITE.name} website handles visitor information.`,
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" crumbs={[{ name: "Privacy Policy" }]} />
      <section className="section">
        <div className="container prose">
          <div className="notice">
            <p>
              <strong>Draft for review.</strong> This policy describes what the current version of the website does. The
              hospital must review and approve the final wording, with legal advice if needed, before launch.
            </p>
          </div>

          <h2>What this website collects</h2>
          <p>
            This version of the website is informational. It has no account login, appointment booking, patient records, or
            enquiry form, so it does not ask visitors to enter personal or medical information.
          </p>

          <h2>Technical data</h2>
          <p>
            Like most websites, the hosting service may record technical data such as IP address, browser type and pages
            requested, for security and to keep the site running. The website does not add advertising or analytics tools.
          </p>

          <h2>Search on this website</h2>
          <p>
            Doctor searches are sent as part of the page address (for example a doctor name). Please do not type patient
            details or medical information into any search box.
          </p>

          <h2>Links to other websites</h2>
          <p>Links to social media or map services open sites run by other organizations, which have their own privacy policies.</p>

          <h2>Changes to this policy</h2>
          <p>If the website later adds forms, appointments or analytics, this policy will be updated before those features are used.</p>

          <h2>Contact</h2>
          <p>Questions about this policy can be sent to the hospital using the details on the Contact Us page.</p>
        </div>
      </section>
    </>
  );
}
