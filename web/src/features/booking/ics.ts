export function makeIcs(title: string, startUtc: string, durationMin: number) {
  const f = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');
  const s = new Date(startUtc);
  const e = new Date(+s + durationMin * 60000);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${f(s)}`,
    `DTEND:${f(e)}`,
    `SUMMARY:${title}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
export function downloadIcs(title: string, startUtc: string, durationMin: number) {
  const url = URL.createObjectURL(
    new Blob([makeIcs(title, startUtc, durationMin)], { type: 'text/calendar' }),
  );
  const a = Object.assign(document.createElement('a'), { href: url, download: 'appointment.ics' });
  a.click();
  URL.revokeObjectURL(url);
}
