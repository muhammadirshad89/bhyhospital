import type { Doctor, OpdDay, Weekday } from "@/lib/types";

/**
 * DOCTORS: published from the hospital's official doctor cards (design-assets/doctor-cards-original/).
 * The card is the source of truth. Name spelling, qualifications, specialty, days and times are copied
 * exactly; nothing has been added. Fields the cards do not contain (bio, contact, fees) are left out.
 * Photographs are the circular portraits cropped from each card (public/doctors/).
 *
 * To add a doctor: add an entry below with the same fields. A doctor is public only when
 * verified, active and approved are true and deleted is false.
 */
const published = { verified: true, active: true, approved: true, deleted: false };

const day = (d: Weekday, start: string, end: string): OpdDay => ({ day: d, sessions: [{ start, end }] });
const MON_FRI: Weekday[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const MON_SAT: Weekday[] = [...MON_FRI, "Saturday"];
const on = (days: Weekday[], start: string, end: string): OpdDay[] => days.map((d) => day(d, start, end));

export const verifiedDoctors: Doctor[] = [
  // ---- Cardiologists ----
  {
    slug: "lal-kumar",
    name: "Dr. Lal Kumar",
    qualifications: ["MBBS", "DIP CARD"],
    specialization: "Cardiologist",
    departmentSlug: "cardiologist",
    photo: "/doctors/lal-kumar.jpg",
    scheduleLines: [{ days: "Monday to Friday", time: "06:00 PM TO 07:00 PM" }],
    opd: on(MON_FRI, "18:00", "19:00"),
    status: published,
  },
  {
    slug: "saleem-sheikh",
    name: "Dr. Saleem Sheikh",
    qualifications: ["MBBS", "DIP CARD"],
    specialization: "Cardiologist",
    departmentSlug: "cardiologist",
    photo: "/doctors/saleem-sheikh.jpg",
    scheduleLines: [{ days: "Monday to Saturday", time: "02:00 PM TO 04:00 PM" }],
    opd: on(MON_SAT, "14:00", "16:00"),
    status: published,
  },
  {
    slug: "sher-muhammad",
    name: "Dr. Sher Muhammad",
    qualifications: ["MBBS", "FCPS", "(CARD)(NICVD)"],
    specialization: "Cardiologist",
    departmentSlug: "cardiologist",
    photo: "/doctors/sher-muhammad.jpg",
    scheduleLines: [{ days: "Monday, Wednesday & Friday", time: "08:00 PM TO 09:00 PM" }],
    opd: on(["Monday", "Wednesday", "Friday"], "20:00", "21:00"),
    status: published,
  },
  // ---- Diabetologists ----
  {
    slug: "asmat-nawaz",
    name: "Dr. Asmat Nawaz",
    qualifications: ["MBBS", "DIAB", "MS (ENDOCRINOLOGY)"],
    specialization: "Diabetologist",
    departmentSlug: "diabetologist-endocrinologist",
    photo: "/doctors/asmat-nawaz.jpg",
    scheduleLines: [{ days: "Monday, Wednesday & Friday", time: "06:00 PM TO 08:00 PM" }],
    opd: on(["Monday", "Wednesday", "Friday"], "18:00", "20:00"),
    status: published,
  },
  {
    slug: "capt-liaquat-ali",
    name: "Dr. Capt. Liaquat Ali",
    qualifications: ["MBBS", "D-DIAB"],
    specialization: "Diabetologist",
    departmentSlug: "diabetologist-endocrinologist",
    photo: "/doctors/capt-liaquat-ali.jpg",
    scheduleLines: [{ days: "Tuesday & Thursday", time: "04:00 PM TO 06:00 PM" }],
    opd: on(["Tuesday", "Thursday"], "16:00", "18:00"),
    status: published,
  },
  {
    slug: "farooq-memon",
    name: "Dr. Farooq Memon",
    qualifications: ["MBBS", "D-DIAB"],
    specialization: "Diabetologist",
    departmentSlug: "diabetologist-endocrinologist",
    photo: "/doctors/farooq-memon.jpg",
    scheduleLines: [
      { days: "Tuesday & Thursday", time: "06:30 PM TO 08:00 PM" },
      { days: "Saturday", time: "04:00 PM TO 06:00 PM" },
    ],
    opd: [...on(["Tuesday", "Thursday"], "18:30", "20:00"), day("Saturday", "16:00", "18:00")],
    status: published,
  },
  {
    slug: "nusrat-solangi",
    name: "Dr. Nusrat Solangi",
    qualifications: ["MBBS", "MS (ENDOCRINOLOGY & DIABETOLOGY)"],
    specialization: "Diabetologist",
    departmentSlug: "diabetologist-endocrinologist",
    photo: "/doctors/nusrat-solangi.jpg",
    scheduleLines: [
      { days: "Monday & Wednesday", time: "04:00 PM TO 06:00 PM" },
      { days: "Saturday", time: "07:00 PM TO 09:00 PM" },
    ],
    opd: [...on(["Monday", "Wednesday"], "16:00", "18:00"), day("Saturday", "19:00", "21:00")],
    status: published,
  },
];

/** No placeholder doctors are published. */
export const placeholderDoctors: Doctor[] = [];
