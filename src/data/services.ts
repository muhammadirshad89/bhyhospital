import type { Service } from "@/lib/types";

/**
 * SERVICES: the five entries under the "SERVICES" heading of
 * design-assets/source-data/Consultant_Schedule_OCT_2026_EXCEL.xlsx (sheet "Table 1").
 * Only the service names are published. Timings and fees in the workbook are NOT shown
 * until the hospital confirms they may be published.
 */
const verified = { verified: true, active: true, approved: true, deleted: false };

export const verifiedServices: Service[] = [
  {
    slug: "ct-scan",
    name: "CT Scan",
    sourceName: "CT SCAN",
    sourceRows: [189],
    summary: "",
    departmentSlugs: [],
    status: verified,
  },
  {
    slug: "echo",
    name: "Echo",
    sourceName: "ECHO",
    sourceRows: [192],
    summary: "",
    departmentSlugs: [],
    status: verified,
  },
  {
    slug: "mammography",
    name: "Mammography",
    sourceName: "MAMMOGRAPHY",
    sourceRows: [196],
    summary: "",
    departmentSlugs: [],
    status: verified,
  },
  {
    slug: "peads-vaccination",
    name: "Peads Vaccination",
    sourceName: "PEADS VACCINATION",
    sourceRows: [199],
    summary: "",
    departmentSlugs: [],
    status: verified,
  },
  {
    slug: "physiotherapy",
    name: "Physiotherapy",
    sourceName: "PHYSIOTHERAPY",
    sourceRows: [201],
    summary: "",
    departmentSlugs: [],
    status: verified,
  },
];
