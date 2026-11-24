import { WHATSAPP, whatsappHref } from "@/data/site";
import { WhatsAppIcon } from "./WhatsAppIcon";

/** Click-to-chat button for the official hospital WhatsApp number. Opens WhatsApp (app or web) in a new tab. */
export function WhatsAppButton({ label = "Chat on WhatsApp", className = "" }: { label?: string; className?: string }) {
  return (
    <a className={`btn btn--whatsapp ${className}`.trim()} href={whatsappHref()} target="_blank" rel="noopener noreferrer">
      <WhatsAppIcon size={20} /> {label}
      <span className="visually-hidden"> with BHY Hospital at {WHATSAPP.display} (opens WhatsApp in a new tab)</span>
    </a>
  );
}
