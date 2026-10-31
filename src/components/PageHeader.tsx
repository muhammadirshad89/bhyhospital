import Link from "next/link";

export interface Crumb {
  name: string;
  href?: string;
}

export function PageHeader({ title, lead, crumbs, eyebrow }: { title: string; lead?: string; crumbs: Crumb[]; eyebrow?: string }) {
  return (
    <section className="page-header">
      <div className="page-header-art" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="container">
        <nav aria-label="Breadcrumb" className="breadcrumbs">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            {crumbs.map((c, i) => (
              <li key={c.name}>
                {c.href && i < crumbs.length - 1 ? <Link href={c.href}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow ? <p className="eyebrow eyebrow--light">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {lead ? <p className="lead">{lead}</p> : null}
      </div>
    </section>
  );
}
