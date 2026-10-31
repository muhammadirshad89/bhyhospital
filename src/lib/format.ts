/** "13:05" -> "1:05 PM". Returns null for invalid input so callers never show guessed times. */
export function formatTime(value: string): string | null {
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!m) return null;
  const h = Number(m[1]);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m[2]} ${suffix}`;
}

export function formatSession(start: string, end: string): string | null {
  const a = formatTime(start);
  const b = formatTime(end);
  if (!a || !b) return null;
  return `${a} to ${b}`;
}

export function initials(name: string): string {
  return name
    .replace(/^(dr\.?|prof\.?)\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
