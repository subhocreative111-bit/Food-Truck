import type { Hours } from './types';

const DAYS: (keyof Hours)[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export function getTodayKey(): keyof Hours {
  return DAYS[new Date().getDay()];
}

/** Returns true if the given hours string for "today" includes the current time. Very forgiving parser. */
export function isOpenNow(hours?: Hours): boolean {
  if (!hours) return false;
  const today = hours[getTodayKey()];
  if (!today || /closed/i.test(today)) return false;
  const m = today.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s*[–-]\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (!m) return false;
  const toMin = (h: string, mm: string | undefined, ap: string) => {
    let n = parseInt(h, 10) % 12;
    if (/pm/i.test(ap)) n += 12;
    return n * 60 + (mm ? parseInt(mm, 10) : 0);
  };
  const start = toMin(m[1], m[2], m[3]);
  let end = toMin(m[4], m[5], m[6]);
  if (end <= start) end += 24 * 60; // overnight
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  return cur >= start && cur < end;
}

export const DAY_LABELS: Record<keyof Hours, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};
