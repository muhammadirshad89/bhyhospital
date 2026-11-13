/**
 * Homepage hero carousel content. Edit this file to change photos, text or order.
 * All photographs are genuine B.H.Y. Hospital photos supplied by the hospital team
 * (originals are kept in design-assets/event-photos-original/; the six current slides were supplied for Phase 1.8). Do not use stock or generated images.
 *
 * - src: file under public/hero/ (2000 px wide JPEG). Next.js serves resized AVIF/WebP versions.
 * - alt: describes only what is visible. Do not add names, events or dates that are not confirmed.
 * - position: CSS object-position used when the photo is cropped to the slide shape.
 * - caption: optional short factual line shown in the panel. Leave out unless confirmed.
 */
export interface HeroSlide {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  position?: string;
  caption?: string;
}

export const HERO_HEADING = "Care, Community & Commitment";
export const HERO_TEXT = "Begum Haji Yousuf Hospital, a project of Jamiyat Punjabi Saudagran-e-Delhi Karachi.";

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "breast-awareness-seminar",
    src: "/hero/breast-awareness-seminar-wide.jpg",
    width: 2000,
    height: 887,
    alt: "A group of women in pink and pastel outfits standing together in front of a pink banner for an event exclusively for women, with the B.H.Y. Hospital and JPSD logos.",
    position: "50% 60%",
  },
  {
    id: "ct-scanner-room",
    src: "/hero/ct-scanner-room-wide.jpg",
    width: 2000,
    height: 887,
    alt: "A Toshiba CT scanner and its examination table in a hospital scan room.",
    position: "50% 45%",
  },
  {
    id: "staff-gathering-may-2026",
    src: "/hero/staff-gathering-may-2026.jpg",
    width: 2000,
    height: 887,
    alt: "Hospital staff in navy scrubs and other clothing standing together under blue, pink and white balloons in front of a B.H.Y. Hospital and JPSD banner dated May 2026.",
    position: "50% 40%",
  },
  {
    id: "flag-gathering-courtyard",
    src: "/hero/flag-gathering-courtyard.jpg",
    width: 2000,
    height: 887,
    alt: "A large group of men in shalwar kameez and other clothing standing together in the hospital courtyard in front of a green and white Pakistani flag display, with the doctors' name boards on the wall behind them.",
    position: "50% 55%",
  },
  {
    id: "hospital-ward-visit",
    src: "/hero/hospital-ward-visit-wide.jpg",
    width: 2000,
    height: 887,
    alt: "A group of men, some wearing medical scrubs, standing together in a hospital ward with blue curtains and beds.",
    position: "50% 35%",
  },
  {
    id: "white-coats-golden-hearts",
    src: "/hero/white-coats-wide.jpg",
    width: 2000,
    height: 887,
    alt: "A group of men and women standing together in front of a B.H.Y. Hospital and JPSD backdrop with golden hearts and the words White Coats.",
    position: "50% 50%",
  },
];
