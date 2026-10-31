/**
 * Site-wide facts.
 * VERIFIED = taken from the official logo artwork supplied by the hospital.
 * Everything with a `null` value is an UNVERIFIED placeholder: fill it in only
 * with information confirmed by the hospital.
 */
export const SITE = {
  name: "Begum Haji Yousuf Hospital",
  shortName: "BHY Hospital",
  organization: "JPSD",
  organizationFull: "Jamiyat Punjabi Saudagran-e-Delhi Karachi",
  projectLine: "A Project of Jamiyat Punjabi Saudagran-e-Delhi Karachi",
  managedBy: "Managed by B.H.Y. Hospital Management Board",
  description:
    "Official website of Begum Haji Yousuf Hospital (BHY Hospital), a project of Jamiyat Punjabi Saudagran-e-Delhi Karachi (JPSD).",
  locale: "en_PK",
} as const;

export interface ContactInfo {
  /** Full address exactly as supplied by the hospital. */
  address: string;
  /** Parts of the same address, used only for structured data. */
  addressParts: { street: string; city: string; postalCode: string; country: string };
  /** Universal Access Number. */
  uan: string;
  uanHref: string;
  phone: string;
  phoneHref: string;
  /** Official Google Maps link for the hospital location. */
  mapUrl: string;
}

/** OFFICIAL contact details supplied by the hospital. Only these numbers are published. */
export const CONTACT: ContactInfo = {
  address: "Delhi Colony, Block 8, off Khaliq-uz-Zaman Road, Block 8 Clifton, Karachi, 75600",
  addressParts: {
    street: "Delhi Colony, Block 8, off Khaliq-uz-Zaman Road, Block 8 Clifton",
    city: "Karachi",
    postalCode: "75600",
    country: "PK",
  },
  uan: "021-111-111-249",
  uanHref: "tel:021111111249",
  phone: "021-35822770",
  phoneHref: "tel:02135822770",
  mapUrl: "https://maps.app.goo.gl/uAQ4F1ASqfLoyGXW7",
};

export interface SocialLink {
  id: "facebook" | "instagram";
  label: string;
  href: string;
}

/** Official profiles only. Do not add other platforms. */
export const SOCIAL_LINKS: SocialLink[] = [
  { id: "facebook", label: "Facebook", href: "https://www.facebook.com/bhyhospitalpk/" },
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/bhyhospitalpk/" },
];

export const NAV_LINKS = [
  { href: "/doctors", label: "Our Doctors" },
  { href: "/departments", label: "Departments" },
  { href: "/services", label: "Services" },
  { href: "/opd-schedule", label: "OPD Schedule" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
] as const;

/** Design and development credit shown in the footer. Exact wording supplied by the developer. */
export const CREDIT = {
  text: "Design & Develop by: Syyed Muhammad Irshad",
  phoneLabel: "Phone:",
  phoneDisplay: "+923218100537",
  phoneHref: "tel:+923218100537",
} as const;
