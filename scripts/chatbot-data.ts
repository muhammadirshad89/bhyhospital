/**
 * Helpers for checking that the website information embedded in public/bhy-chatbot.js (the WEB directory) still
 * matches the website's own data (src/data/doctors.ts). Read-only: nothing here changes the chatbot or the website.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Doctor } from "../src/lib/types";

export const CHATBOT_PATH = join(process.cwd(), "public", "bhy-chatbot.js");
export const readChatbot = (path = CHATBOT_PATH) => readFileSync(path, "utf8");

/** Reads `var NAME = [ ... ];` out of the chatbot file as JSON (string-aware bracket matching). */
export function extractArray<T = unknown[]>(source: string, name: string): T {
  const start = source.indexOf(`var ${name} = [`);
  if (start < 0) throw new Error(`var ${name} was not found in the chatbot file.`);
  let i = source.indexOf("[", start);
  const from = i;
  let depth = 0;
  let inStr = false;
  for (; i < source.length; i++) {
    const c = source[i];
    if (inStr) {
      if (c === "\\") i++;
      else if (c === '"') inStr = false;
    } else if (c === '"') inStr = true;
    else if (c === "[") depth++;
    else if (c === "]" && --depth === 0) return JSON.parse(source.slice(from, i + 1)) as T;
  }
  throw new Error(`var ${name} is not a complete array.`);
}

/** WEB row: [slug, website name, specialty id, qualifications, link type, schedule-file name, [[days, timing, flags, note]]] */
export type WebRow = [string, string, string, string, "ex" | "sp" | "nm", string, [string, string, string, string][]];

const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
/** "06:00 PM TO 07:00 PM (PRE-APPOINTMENT)" and "06:00 PM – 07:00 PM" compare equal; notes in brackets are stored separately in the chatbot. */
const normTime = (s: string) => s.replace(/\(.*?\)/g, "").replace(/\s+TO\s+/i, " – ").replace(/\s+/g, " ").trim().toUpperCase();

export interface Drift {
  slug: string;
  problem: string;
}

/** Differences between the chatbot's website directory and the website's doctor data. Empty = in sync. */
export function compareWebDirectory(web: WebRow[], doctors: Doctor[]): Drift[] {
  const out: Drift[] = [];
  const bySlug = new Map(web.map((w) => [w[0], w]));
  for (const d of doctors) {
    const w = bySlug.get(d.slug);
    if (!w) {
      out.push({ slug: d.slug, problem: `${d.name} is on the website but not in the chatbot (add to WEB)` });
      continue;
    }
    if (w[1] !== d.name) out.push({ slug: d.slug, problem: `name differs: chatbot "${w[1]}", website "${d.name}"` });
    if (w[3] !== d.qualifications.join(", ")) out.push({ slug: d.slug, problem: `qualifications differ: chatbot "${w[3]}", website "${d.qualifications.join(", ")}"` });
    const webTimes = w[6].map((s) => normTime(s[1])).sort().join(" | ");
    const siteTimes = d.scheduleLines.map((l) => normTime(l.time)).sort().join(" | ");
    if (webTimes !== siteTimes) out.push({ slug: d.slug, problem: `timings differ: chatbot "${webTimes}", website "${siteTimes}"` });
    if (d.opd.length) {
      const webDays = [...new Set(w[6].flatMap((s) => s[0].split("")))].sort().join("");
      const siteDays = [...new Set(d.opd.map((o) => String(DAY.indexOf(o.day))))].sort().join("");
      if (webDays !== siteDays) out.push({ slug: d.slug, problem: `days differ: chatbot "${webDays}", website "${siteDays}" (0 = Sunday)` });
    }
  }
  const siteSlugs = new Set(doctors.map((d) => d.slug));
  for (const w of web) if (!siteSlugs.has(w[0])) out.push({ slug: w[0], problem: `${w[1]} is in the chatbot but no longer on the website (remove from WEB)` });
  return out;
}
