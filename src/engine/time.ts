// Time maths on the wall-clock time the user typed. Everything is done in
// UTC so results never shift with the viewer's time zone or clock changes.

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Parses YYYY-MM-DDTHH:mm. Returns null if it is not a real date and time. */
export function parseLocal(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const [y, mo, d, h, mi] = m.slice(1).map(Number);
  const date = new Date(Date.UTC(y, mo - 1, d, h, mi));
  const valid =
    date.getUTCFullYear() === y && date.getUTCMonth() === mo - 1 && date.getUTCDate() === d &&
    date.getUTCHours() === h && date.getUTCMinutes() === mi;
  return valid ? date : null;
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

const pad = (n: number) => String(n).padStart(2, '0');

export const clock = (d: Date) => `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
export const dayName = (d: Date) => DAYS[d.getUTCDay()];
export const shortDate = (d: Date) => `${DAYS[d.getUTCDay()].slice(0, 3)} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
export const longDate = (d: Date) => `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;

/** "Wed 17 Aug, 15:00" */
export const stamp = (d: Date) => `${shortDate(d)}, ${clock(d)}`;

function span(minutes: number): string {
  if (minutes >= 120 && minutes % 60 === 0) return `${minutes / 60} h`;
  if (minutes >= 120) return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
  return `${minutes} min`;
}

/** "72 h before", "Kick-off", "2 h after kick-off" */
export function relativeLabel(at: number, startWord: string): string {
  if (at === 0) return startWord;
  if (at < 0) return `${span(-at)} before`;
  return `${span(at)} after ${startWord.toLowerCase()}`;
}
