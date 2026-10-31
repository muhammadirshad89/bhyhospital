export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
export type Weekday = (typeof WEEKDAYS)[number];

/** Publishing flags. A record is public only when verified && active && approved && !deleted. */
export interface RecordStatus {
  verified: boolean;
  active: boolean;
  approved: boolean;
  deleted: boolean;
}

/** 24-hour "HH:MM" strings, e.g. "09:30". */
export interface OpdSession {
  start: string;
  end: string;
  /** Optional label such as "Morning". Only add if confirmed. */
  label?: string;
}

export interface OpdDay {
  day: Weekday;
  sessions: OpdSession[];
  /** Confirmed note for this day, e.g. a verified change. Leave empty if none. */
  note?: string;
}

export interface Doctor {
  slug: string;
  name: string;
  /** Verified qualifications only. */
  qualifications: string[];
  specialization: string | null;
  departmentSlug: string | null;
  /** Path under /public or an absolute https URL. null shows a neutral "photo pending" image. */
  photo: string | null;
  bio?: string;
  /** Consultation days and times exactly as printed on the hospital's doctor card. */
  scheduleLines: { days: string; time: string }[];
  /** Structured version of the same schedule, used by the OPD page. Must match scheduleLines. */
  opd: OpdDay[];
  status: RecordStatus;
  /** True for clearly labelled placeholder records. Never indexed or put in structured data. */
  isPlaceholder?: boolean;
}

export interface Department {
  slug: string;
  name: string;
  /** Heading exactly as written in the hospital workbook (traceability). */
  sourceName?: string;
  /** Workbook row number(s) where the heading appears. */
  sourceRows?: number[];
  /** Internal flag for the hospital to confirm. Never shown to visitors. */
  reviewNote?: string;
  summary: string;
  description: string;
  status: RecordStatus;
  isPlaceholder?: boolean;
}

export interface Service {
  slug: string;
  name: string;
  sourceName?: string;
  sourceRows?: number[];
  summary: string;
  departmentSlugs: string[];
  status: RecordStatus;
  isPlaceholder?: boolean;
}

/** Confirmed schedule change announcements (shown on the OPD page). */
export interface ScheduleNotice {
  /** Human-readable date as confirmed by the hospital. */
  date: string;
  text: string;
}
