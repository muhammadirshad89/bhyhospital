/**
 * Sunday OPD promotion, taken from the hospital's official "Sunday Consultant OPD" poster
 * (original kept in design-assets/sunday-opd/). The poster is in Urdu; the English text below is a
 * faithful transcription of its specialties and times. Do not add specialties or times that are not on the poster.
 */
export const SUNDAY_OPD = {
  heading: "Sunday OPD – Open Every Sunday",
  intro: "Consultant OPD is available at B.H.Y. Hospital on Sundays as well. Sunday consultant timings from the hospital's official poster:",
  poster: {
    src: "/sunday-opd/sunday-consultant-opd.jpg",
    width: 1600,
    height: 1606,
    alt: "Official B.H.Y. Hospital and JPSD poster titled Sunday Consultant OPD, in Urdu. It lists Sunday consultation times for the dental surgeon, general physician, child specialist, gynaecologist, ultrasound by a female sonologist, orthopaedic surgeon, ENT surgeon and general surgeon, and gives the UAN 021-111-111-249.",
  },
  /** In the poster's reading order (right to left, top row then bottom row). */
  sessions: [
    { specialty: "Dental Surgeon", time: "4:00 PM – 7:00 PM" },
    { specialty: "General Physician", time: "2:00 PM – 8:00 PM" },
    { specialty: "Child Specialist", time: "4:00 PM – 10:00 PM" },
    { specialty: "Gynaecologist", time: "3:00 PM – 7:00 PM" },
    { specialty: "Ultrasound (female sonologist)", time: "4:00 PM – 6:00 PM" },
    { specialty: "Orthopaedic Surgeon", time: "2:00 PM – 8:00 PM" },
    { specialty: "ENT Surgeon", time: "6:00 PM – 8:00 PM" },
    { specialty: "General Surgeon", time: "3:00 PM – 4:30 PM" },
  ],
  note: "For more information, contact the OPD information counter (as printed on the poster).",
} as const;
