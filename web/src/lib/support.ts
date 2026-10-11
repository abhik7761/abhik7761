import { support } from '@/config/support';

/** Returns true if the support desk is open at `now`, evaluated in America/New_York (DST-safe). */
export function isSupportOnline(now = new Date()): boolean {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: support.timezone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  const dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  if (!support.days.includes(dow)) return false;
  if (support.holidays.includes(`${get('year')}-${get('month')}-${get('day')}`)) return false;
  const mins = (Number(get('hour')) % 24) * 60 + Number(get('minute'));
  const toMin = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3));
  return mins >= toMin(support.open) && mins < toMin(support.close);
}
