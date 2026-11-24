import { WHATSAPP, whatsappHref } from "@/data/site";
import { WhatsAppIcon } from "./WhatsAppIcon";

/**
 * Floating WhatsApp button on every public page (desktop and mobile). It sits at the bottom LEFT so it never covers the
 * chat widget icon and its message bubbles at the bottom right.
 */
export function WhatsAppFloat() {
  return (
    <a className="wa-float" href={whatsappHref()} target="_blank" rel="noopener noreferrer" aria-label={`${WHATSAPP.label} (opens in a new tab)`}>
      <WhatsAppIcon size={28} />
      <span className="wa-float-text" aria-hidden="true">
        WhatsApp
      </span>
    </a>
  );
}
