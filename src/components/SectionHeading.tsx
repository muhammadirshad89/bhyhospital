import Link from "next/link";
import { BreakableName } from "./BreakableName";
import { Icon } from "./Icon";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  href,
  hrefLabel,
  id,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  href?: string;
  hrefLabel?: string;
  id?: string;
  center?: boolean;
}) {
  return (
    <div className={`section-heading${center ? " section-heading--center" : ""}`}>
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 id={id}>
          <BreakableName name={title} />
        </h2>
        {intro ? <p className="section-intro">{intro}</p> : null}
      </div>
      {href && hrefLabel ? (
        <Link className="link-arrow" href={href}>
          {hrefLabel}
          <Icon name="arrow-right" size={18} />
        </Link>
      ) : null}
    </div>
  );
}
