import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { getServices } from "@/lib/repository";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Medical Services",
  description: "Medical services at Begum Haji Yousuf Hospital, including CT scan, echocardiography, mammography, sonologist, Paeds vaccination and physiotherapy, with availability.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageHeader
        eyebrow="Care and diagnostics"
        title="Medical Services"
        lead="Open a service to see its availability. Call the UAN to confirm before you travel."
        crumbs={[{ name: "Medical Services" }]}
      />
      <section className="section">
        <div className="container">
          {services.length ? (
            <ul className="service-grid service-grid--wide">
              {services.map((s) => (
                <ServiceCard key={s.slug} service={s} headingLevel={2} />
              ))}
            </ul>
          ) : (
            <div className="empty">
              <h2>The service list is coming soon</h2>
              <p>Services are published after the hospital confirms them.</p>
            </div>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
