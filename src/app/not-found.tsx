import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="section state-page">
      <div className="container narrow">
        <span className="icon-chip icon-chip--lg" aria-hidden="true">
          <Icon name="search" size={34} />
        </span>
        <p className="eyebrow">Error 404</p>
        <h1>Page not found</h1>
        <p className="lead">The page you asked for does not exist or has moved.</p>
        <p className="actions">
          <Link className="btn btn--solid" href="/">
            Go to the home page
          </Link>
          <Link className="btn btn--outline" href="/doctors">
            Find a doctor
          </Link>
          <Link className="btn btn--outline" href="/departments">
            Departments
          </Link>
        </p>
      </div>
    </section>
  );
}
