/**
 * Homepage hero carousel content. Edit this file to change photos, text or order.
 * All photographs are genuine B.H.Y. Hospital photos supplied by the hospital team
 * (originals are kept in design-assets/event-photos-original/). Do not use stock or generated images.
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
    id: "staff-gathering",
    src: "/hero/staff-gathering-banner.jpg",
    width: 2000,
    height: 887,
    alt: "Hospital staff in navy scrubs and other clothing standing together under blue, pink and white balloons in front of a B.H.Y. Hospital and JPSD banner dated May 2026.",
    position: "50% 40%",
  },
  {
    id: "ribbon-cutting",
    src: "/hero/ribbon-cutting.jpg",
    width: 2000,
    height: 1500,
    alt: "A group of men gathered around a blue ribbon being cut with scissors inside a B.H.Y. Hospital room.",
    position: "50% 35%",
  },
  {
    id: "ward-group",
    src: "/hero/ward-group.jpg",
    width: 2000,
    height: 1125,
    alt: "A group of men, some wearing medical scrubs, standing together in a hospital ward with blue curtains and beds.",
    position: "50% 25%",
  },
  {
    id: "ct-scan-room",
    src: "/hero/ct-scan-room.jpg",
    width: 2000,
    height: 1333,
    alt: "A Toshiba CT scanner and its examination table in a hospital scan room.",
    position: "50% 45%",
  },
  {
    id: "sugar-check-counter",
    src: "/hero/sugar-check-counter.jpg",
    width: 2000,
    height: 887,
    alt: "Four men at a blue table labelled Sugar Check Counter, with blood glucose meters on the table.",
    position: "50% 50%",
  },
];
