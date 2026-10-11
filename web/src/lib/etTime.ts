import { support } from '@/config/support';

/** UTC instant at which America/New_York wall-clock reads `hhmm` on `ref`'s ET calendar date. */
export function etWallToDate(hhmm: string, ref = new Date()): Date {
  const [h, m] = hhmm.split(':').map(Number);
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: support.timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
      .formatToParts(ref)
      .map((x) => [x.type, x.value]),
  );
  const guess = Date.UTC(+p.year, +p.month - 1, +p.day, h, m);
  const shown = new Date(guess).toLocaleString('en-US', { timeZone: support.timezone, hour12: false });
  const sd = new Date(shown.replace(', 24:', ', 00:') + ' UTC').getTime();
  return new Date(guess - (sd - guess));
}
