import type { Service } from "@/lib/types";

/**
 * SERVICES. Names come from the hospital workbook (design-assets/source-data/, rows under "SERVICES");
 * availability comes from the hospital's services plates (design-assets/name-plates/, Phase 1.7) and is shown exactly as printed.
 * Only the genuine CT scanner photograph supplied by the hospital is used as an image.
 * Do not add facilities, treatments or claims that are not on those plates.
 */
const verified = { verified: true, active: true, approved: true, deleted: false };

export const verifiedServices: Service[] = [
  {
    slug: "ct-scan",
    name: "CT Scan",
    sourceName: "CT SCAN",
    sourceRows: [189],
    summary: "CT scan service, available 24X7.",
    departmentSlugs: [],
    sessions: [{ time: "24X7" }],
    image: {
      src: "/hero/ct-scan-room.jpg",
      width: 2000,
      height: 1333,
      alt: "A Toshiba CT scanner and its examination table in a hospital scan room.",
    },
    status: verified,
  },
  {
    slug: "echocardiography",
    name: "Echocardiography",
    sourceName: "ECHO",
    sourceRows: [192],
    summary: "Echocardiography sessions with a female echocardiographer and a male echocardiographer.",
    departmentSlugs: [],
    sessions: [
      { label: "Female echocardiographer", days: "Tuesday, Thursday & Saturday", time: "04:00 PM to 07:00 PM" },
      { label: "Male echocardiographer", days: "Monday, Wednesday & Friday", time: "07:00 PM to 09:00 PM" },
    ],
    status: verified,
  },
  {
    slug: "mammography",
    name: "Mammography",
    sourceName: "MAMMOGRAPHY",
    sourceRows: [196],
    summary: "Mammography on Saturdays, by pre-appointment.",
    departmentSlugs: [],
    sessions: [{ days: "Saturday", time: "03:00 PM to 05:00 PM", note: "Pre-Appointment" }],
    status: verified,
  },
  {
    slug: "sonologist",
    name: "Sonologist",
    summary: "Sonologist sessions Monday to Saturday, and on Sundays.",
    departmentSlugs: ["sonologist"],
    sessions: [
      { label: "Dr. Kehkashan Khoso", days: "Monday to Saturday", time: "11:30 AM to 01:00 PM", doctorSlug: "kehkashan-khoso" },
      { label: "Dr. Qurat-ul-ain", days: "Monday to Saturday", time: "01:30 PM to 04:00 PM", doctorSlug: "qurat-ul-ain" },
      { label: "Dr. Najma Memon", days: "Monday to Saturday", time: "04:30 PM to 07:30 PM", doctorSlug: "najma-memon" },
      { label: "Dr. Manesh Kumar", days: "Monday to Saturday", time: "08:00 PM to 10:00 PM", doctorSlug: "manesh-kumar" },
      { label: "Ambreen Sohaib", days: "Sunday", time: "04:00 PM to 06:00 PM", doctorSlug: "ambreen-sohaib" },
    ],
    status: verified,
  },
  {
    slug: "paeds-vaccination",
    name: "Paeds Vaccination",
    sourceName: "PEADS VACCINATION",
    sourceRows: [199],
    summary: "Paeds vaccination, Monday to Saturday.",
    departmentSlugs: [],
    sessions: [{ label: "Vaccinator", days: "Monday to Saturday", time: "10:00 AM to 02:00 PM" }],
    status: verified,
  },
  {
    slug: "physiotherapy",
    name: "Physiotherapy",
    sourceName: "PHYSIOTHERAPY",
    sourceRows: [201],
    summary: "Physiotherapy with a female physiotherapist and a male physiotherapist, Monday to Saturday.",
    departmentSlugs: [],
    sessions: [
      { label: "Female Physiotherapist", days: "Monday to Saturday", time: "10:00 AM to 05:00 PM" },
      { label: "Male Physiotherapist", days: "Monday to Saturday", time: "04:00 PM to 07:00 PM" },
    ],
    status: verified,
  },
];

export const placeholderServices: Service[] = [];
